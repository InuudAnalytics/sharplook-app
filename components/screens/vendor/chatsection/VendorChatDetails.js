import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  AppState,
  Keyboard,
  Linking,
  Alert,
  StatusBar,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import { useAuth } from "../../../../context/AuthContext";
import { io } from "socket.io-client";
import { HttpClient } from "../../../../api/HttpClient";
import {
  RTCPeerConnection,
  RTCView,
  mediaDevices,
  RTCIceCandidate,
  RTCSessionDescription,
} from "react-native-webrtc";

export default function VendorChatDetail() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user, userId } = useAuth();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // ⭐ Receiver (client) online status state
  const [isReceiverOnline, setIsReceiverOnline] = useState(false);
  const [receiverLastSeen, setReceiverLastSeen] = useState(null);

  // ⭐ Typing indicator state
  const [isTyping, setIsTyping] = useState(false);
  const [isReceiverTyping, setIsReceiverTyping] = useState(false);

  // ⭐ Call states
  const [isCallActive, setIsCallActive] = useState(false);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [callType, setCallType] = useState(null); // 'audio' or 'video'
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [incomingOffer, setIncomingOffer] = useState(null);
  const [incomingCallerId, setIncomingCallerId] = useState(null);

  // Refs
  const socketRef = useRef(null);
  const scrollViewRef = useRef(null);
  const textInputRef = useRef(null);
  const markAsReadTimeoutRef = useRef(null);
  const hasUnreadMessages = useRef(false);
  const isInitialized = useRef(false);
  const typingTimeoutRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const callTimerRef = useRef(null);
  const pendingIceCandidates = useRef([]);

  // WebRTC Configuration
  const rtcConfiguration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" },
    ],
  };

  // Memoized route params to prevent re-computation
  const routeParams = useMemo(
    () => ({
      roomId: route.params.roomId,
      receiverName: route.params.receiverName || "Chat",
      connectionEstablished: route.params.connectionEstablished || false,
      preEstablishedSocket: route.params.socket,
      clientPhone: route.params.clientPhone,
      chat: route.params.chat,
      receiverId:
        route.params.receiverId ||
        getReceiverIdFromRoomId(route.params.roomId, userId),
    }),
    [route.params, userId]
  );

  const { roomId, receiverName, clientPhone, chat, receiverId } = routeParams;

  // Extract receiverId from roomId if not provided
  function getReceiverIdFromRoomId(roomId, currentUserId) {
    if (!roomId || !currentUserId) return null;
    const participants = roomId.split("_");
    return participants.find((id) => id !== currentUserId);
  }

  // Hide bottom tab bar when this screen is focused
  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: "none" },
      });

      return () => {
        navigation.getParent()?.setOptions({
          tabBarStyle: { backgroundColor: "#FFFAFD", borderTopWidth: 0 },
        });
      };
    }, [navigation])
  );

  // Optimized mark messages as read
  const markMessagesAsRead = useCallback(async () => {
    try {
      if (!hasUnreadMessages.current) return;

      const response = await HttpClient.patch(`/messages/${roomId}/read`);
      if (response.data.success) {
        hasUnreadMessages.current = false;

        setMessages((prevMessages) =>
          prevMessages.map((msg) => ({
            ...msg,
            seen: msg.senderId !== userId ? true : msg.seen,
            seenAt:
              msg.senderId !== userId ? new Date().toISOString() : msg.seenAt,
          }))
        );

        if (socketRef.current?.connected) {
          socketRef.current.emit("messagesRead", { roomId, userId });
        }
      }
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  }, [roomId, userId]);

  // Debounced mark as read function
  const debouncedMarkAsRead = useCallback(() => {
    if (markAsReadTimeoutRef.current) {
      clearTimeout(markAsReadTimeoutRef.current);
    }

    markAsReadTimeoutRef.current = setTimeout(() => {
      markMessagesAsRead();
    }, 1000);
  }, [markMessagesAsRead]);

  // Optimized fetch messages
  const fetchMessages = useCallback(async () => {
    try {
      const response = await HttpClient.get(`/messages/user/getVendorChats`);
      if (response.data.success && response.data.data) {
        const currentChat = response.data.data.find(
          (chat) => chat.roomId === roomId
        );

        if (currentChat && currentChat.messages) {
          const chatMessages = currentChat.messages.map((msg, index) => ({
            id: msg.id || `msg_${index}_${Date.now()}`,
            senderId: msg.senderId,
            message: msg.message,
            createdAt: msg.createdAt,
            type: "text",
            sent: true,
            delivered: true,
            seen: msg.seen || false,
            seenAt: msg.seenAt || null,
          }));

          const sortedMessages = chatMessages.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
          setMessages(sortedMessages);

          const unreadMessages = sortedMessages.filter(
            (msg) => msg.senderId !== userId && !msg.seen
          );
          hasUnreadMessages.current = unreadMessages.length > 0;

          if (hasUnreadMessages.current) {
            debouncedMarkAsRead();
          }
        } else {
          setMessages([]);
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [roomId, userId, debouncedMarkAsRead]);

  // ⭐ Format last seen text
  const formatLastSeen = useCallback((lastSeenDate) => {
    if (!lastSeenDate) return "Offline";
    
    const now = new Date();
    const lastSeen = new Date(lastSeenDate);
    const diffMs = now - lastSeen;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Last seen just now";
    if (diffMins < 60) return `Last seen ${diffMins}m ago`;
    if (diffHours < 24) return `Last seen ${diffHours}h ago`;
    if (diffDays === 1) return "Last seen yesterday";
    if (diffDays < 7) return `Last seen ${diffDays}d ago`;
    
    return `Last seen ${lastSeen.toLocaleDateString()}`;
  }, []);

  // ⭐ Handle typing indicator
  const handleTyping = useCallback(() => {
    if (!socketRef.current?.connected || !roomId) return;

    if (!isTyping) {
      setIsTyping(true);
      socketRef.current.emit("typing", { roomId, senderId: userId });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socketRef.current.emit("stopTyping", { roomId, senderId: userId });
    }, 3000);
  }, [roomId, userId, isTyping]);

  // ==================== WebRTC Functions ====================

  // Initialize local media stream
  const initializeLocalStream = useCallback(async (isVideoCall) => {
    try {
      console.log("🎥 Initializing local stream, video:", isVideoCall);
      const stream = await mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: isVideoCall
          ? {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: "user",
              frameRate: { ideal: 30 },
            }
          : false,
      });

      console.log("✅ Local stream initialized:", stream.id);
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error("❌ Error accessing media devices:", error);
      Alert.alert(
        "Media Error",
        "Could not access camera/microphone. Please check permissions."
      );
      return null;
    }
  }, []);

  // Create peer connection
  const createPeerConnection = useCallback(() => {
    console.log("🔗 Creating peer connection");
    const peerConnection = new RTCPeerConnection(rtcConfiguration);

    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socketRef.current?.connected) {
        console.log("📤 Sending ICE candidate to:", receiverId);
        socketRef.current.emit("ice-candidate", {
          toUserId: receiverId,
          fromUserId: userId,
          candidate: event.candidate,
        });
      }
    };

    peerConnection.ontrack = (event) => {
      console.log("📥 Received remote track:", event.streams[0]?.id);
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    peerConnection.oniceconnectionstatechange = () => {
      console.log("🔌 ICE connection state:", peerConnection.iceConnectionState);
      if (
        peerConnection.iceConnectionState === "failed" ||
        peerConnection.iceConnectionState === "disconnected"
      ) {
        Alert.alert("Connection Lost", "The call connection was lost");
        endCall();
      }
    };

    peerConnection.onconnectionstatechange = () => {
      console.log("🔌 Connection state:", peerConnection.connectionState);
      if (
        peerConnection.connectionState === "disconnected" ||
        peerConnection.connectionState === "failed"
      ) {
        endCall();
      } else if (peerConnection.connectionState === "connected") {
        console.log("✅ Peer connection established successfully");
      }
    };

    peerConnectionRef.current = peerConnection;
    return peerConnection;
  }, [receiverId, userId]);

  // Start outgoing call
  const startCall = useCallback(
    async (isVideoCall) => {
      try {
        console.log("📞 Starting", isVideoCall ? "video" : "audio", "call to:", receiverId);
        
        if (!socketRef.current?.connected) {
          Alert.alert("Connection Error", "Please check your internet connection");
          return;
        }

        if (!receiverId) {
          Alert.alert("Error", "Client information is missing");
          return;
        }

        // Check if client is online before starting call
        if (!isReceiverOnline) {
          Alert.alert("Client Offline", `${receiverName} is currently offline`);
          return;
        }

        setCallType(isVideoCall ? "video" : "audio");
        setIsCallActive(true);
        setIsVideoEnabled(isVideoCall);
        pendingIceCandidates.current = [];

        // Get local stream
        const stream = await initializeLocalStream(isVideoCall);
        if (!stream) {
          setIsCallActive(false);
          return;
        }

        // Create peer connection
        const peerConnection = createPeerConnection();

        // Add local stream tracks to peer connection
        stream.getTracks().forEach((track) => {
          console.log("➕ Adding track to peer connection:", track.kind);
          peerConnection.addTrack(track, stream);
        });

        // Create and send offer
        console.log("📤 Creating offer...");
        const offer = await peerConnection.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: isVideoCall,
        });
        
        await peerConnection.setLocalDescription(offer);
        console.log("✅ Local description set, sending offer");

        socketRef.current.emit("call:offer", {
          toUserId: receiverId,
          fromUserId: userId,
          offer: offer,
          callType: isVideoCall ? "video" : "audio",
        });

        // Start call timer
        callTimerRef.current = setInterval(() => {
          setCallDuration((prev) => prev + 1);
        }, 1000);
      } catch (error) {
        console.error("❌ Error starting call:", error);
        Alert.alert("Call Error", "Failed to start call: " + error.message);
        endCall();
      }
    },
    [receiverId, userId, isReceiverOnline, receiverName, initializeLocalStream, createPeerConnection]
  );

  // Answer incoming call
  const answerCall = useCallback(async () => {
    try {
      console.log("📞 Answering incoming call");
      setIsIncomingCall(false);
      setIsCallActive(true);
      setIsVideoEnabled(callType === "video");
      pendingIceCandidates.current = [];

      // Get local stream
      const stream = await initializeLocalStream(callType === "video");
      if (!stream) {
        endCall();
        return;
      }

      // Create peer connection
      const peerConnection = createPeerConnection();

      // Add local stream tracks
      stream.getTracks().forEach((track) => {
        console.log("➕ Adding track to peer connection:", track.kind);
        peerConnection.addTrack(track, stream);
      });

      // Set remote description from incoming offer
      console.log("📥 Setting remote description from offer");
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(incomingOffer)
      );

      // Add any pending ICE candidates
      if (pendingIceCandidates.current.length > 0) {
        console.log("➕ Adding", pendingIceCandidates.current.length, "pending ICE candidates");
        for (const candidate of pendingIceCandidates.current) {
          try {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (err) {
            console.error("Error adding pending ICE candidate:", err);
          }
        }
        pendingIceCandidates.current = [];
      }

      // Create and send answer
      console.log("📤 Creating answer...");
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      console.log("✅ Local description set, sending answer");

      socketRef.current.emit("call:answer", {
        toUserId: incomingCallerId,
        fromUserId: userId,
        answer: answer,
      });

      // Start call timer
      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("❌ Error answering call:", error);
      Alert.alert("Call Error", "Failed to answer call: " + error.message);
      endCall();
    }
  }, [
    callType,
    incomingOffer,
    incomingCallerId,
    userId,
    initializeLocalStream,
    createPeerConnection,
  ]);

  // Decline incoming call
  const declineCall = useCallback(() => {
    console.log("❌ Declining incoming call");
    setIsIncomingCall(false);
    setIncomingOffer(null);
    setIncomingCallerId(null);
    setCallType(null);
    
    if (socketRef.current?.connected && incomingCallerId) {
      socketRef.current.emit("call:end", {
        toUserId: incomingCallerId,
        fromUserId: userId,
      });
    }
  }, [incomingCallerId, userId]);

  // End call
  const endCall = useCallback(() => {
    console.log("📞 Ending call");
    
    // Stop call timer
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Stop local stream
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
        console.log("⏹️ Stopped track:", track.kind);
      });
      setLocalStream(null);
    }

    // Clear remote stream
    setRemoteStream(null);

    // Emit call end event
    if (socketRef.current?.connected && receiverId) {
      socketRef.current.emit("call:end", {
        toUserId: receiverId,
        fromUserId: userId,
      });
    }

    // Reset call states
    setIsCallActive(false);
    setIsIncomingCall(false);
    setCallType(null);
    setCallDuration(0);
    setIsMuted(false);
    setIsVideoEnabled(true);
    setIncomingOffer(null);
    setIncomingCallerId(null);
    pendingIceCandidates.current = [];
  }, [localStream, receiverId, userId]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted((prev) => !prev);
      console.log("🔇 Mute toggled:", !isMuted);
    }
  }, [localStream, isMuted]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStream && callType === "video") {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled((prev) => !prev);
      console.log("📹 Video toggled:", !isVideoEnabled);
    }
  }, [localStream, callType, isVideoEnabled]);

  // Toggle speaker
  const toggleSpeaker = useCallback(() => {
    setIsSpeakerOn((prev) => !prev);
    console.log("🔊 Speaker toggled:", !isSpeakerOn);
  }, [isSpeakerOn]);

  // Format call duration
  const formatCallDuration = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  // ==================== Socket Setup ====================

  // Optimized socket setup
  const setupSocketConnection = useCallback(() => {
    if (!userId || !roomId || isInitialized.current) return;

    isInitialized.current = true;
    setConnectionStatus("connecting");

    // Create new socket connection
    const socket = io("https://sharplook-backend-zd8j.onrender.com", {
      query: { userId },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      forceNew: false,
      autoConnect: true,
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on("connect", () => {
      console.log("✅ Vendor socket connected");
      setConnectionStatus("connected");
      socket.emit("join-room", roomId);
      
      // Emit current user's online status
      socket.emit("user:online", { userId });
      console.log("✅ Vendor marked online:", userId);
      
      // Check client's online status
      if (receiverId) {
        socket.emit("user:checkStatus", { userId: receiverId });
        console.log("🔍 Checking client status:", receiverId);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Vendor socket disconnected");
      setConnectionStatus("disconnected");
      socket.emit("user:offline", { userId });
    });

    socket.on("reconnect", () => {
      console.log("🔄 Vendor socket reconnected");
      setConnectionStatus("connected");
      socket.emit("join-room", roomId);
      socket.emit("user:online", { userId });
      
      // Re-check client status on reconnect
      if (receiverId) {
        socket.emit("user:checkStatus", { userId: receiverId });
      }
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Vendor socket connection error:", error);
      setConnectionStatus("error");
    });

    // ⭐ Listen for client's online status updates
    socket.on("user:online", ({ userId: onlineUserId }) => {
      console.log("👤 User came online:", onlineUserId);
      if (onlineUserId === receiverId) {
        setIsReceiverOnline(true);
        setReceiverLastSeen(null);
        console.log("✅ Client is now online:", receiverId);
      }
    });

    socket.on("user:offline", ({ userId: offlineUserId, lastSeen }) => {
      console.log("👤 User went offline:", offlineUserId);
      if (offlineUserId === receiverId) {
        setIsReceiverOnline(false);
        setReceiverLastSeen(lastSeen);
        console.log("❌ Client is now offline:", receiverId);
      }
    });

    // Listen for user status response
    socket.on("user:status", ({ userId: statusUserId, isOnline, lastSeen }) => {
      console.log("📊 Received status for:", statusUserId, "online:", isOnline);
      if (statusUserId === receiverId) {
        setIsReceiverOnline(isOnline);
        setReceiverLastSeen(lastSeen);
      }
    });

    // ⭐ Typing indicators
    socket.on("userTyping", ({ roomId: typingRoomId, senderId }) => {
      if (typingRoomId === roomId && senderId === receiverId) {
        setIsReceiverTyping(true);
      }
    });

    socket.on("userStoppedTyping", ({ roomId: typingRoomId, senderId }) => {
      if (typingRoomId === roomId && senderId === receiverId) {
        setIsReceiverTyping(false);
      }
    });

    // Message event handlers
    socket.on("newMessage", (message) => {
      if (message.roomId === roomId) {
        setMessages((prevMessages) => {
          const messageExists = prevMessages.some(
            (msg) =>
              msg.id === message.id ||
              (msg.tempId && msg.tempId === message.tempId)
          );

          if (!messageExists) {
            if (message.senderId !== userId) {
              hasUnreadMessages.current = true;
              debouncedMarkAsRead();
            }
            return [...prevMessages, message];
          }

          return prevMessages.map((msg) =>
            msg.tempId === message.tempId ? message : msg
          );
        });
      }
    });

    socket.on(
      "messageDelivered",
      ({ messageId, tempId, status, roomId: msgRoomId }) => {
        if (msgRoomId === roomId) {
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === messageId || msg.tempId === tempId
                ? { ...msg, delivered: true, status: status || "delivered" }
                : msg
            )
          );
        }
      }
    );

    socket.on(
      "messageSeen",
      ({ messageId, tempId, seenAt, roomId: msgRoomId }) => {
        if (msgRoomId === roomId) {
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === messageId || msg.tempId === tempId
                ? { ...msg, seen: true, seenAt }
                : msg
            )
          );
        }
      }
    );

    socket.on("messagesRead", ({ roomId: readRoomId, userId: readUserId }) => {
      if (readRoomId === roomId && readUserId !== userId) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) => ({
            ...msg,
            seen: msg.senderId === userId ? true : msg.seen,
            seenAt:
              msg.senderId === userId ? new Date().toISOString() : msg.seenAt,
          }))
        );
      }
    });

    socket.on("messageSent", (data) => {
      const { tempId, message: sentMessage } = data;
      if (sentMessage.roomId === roomId) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.tempId === tempId
              ? {
                  ...msg,
                  id: sentMessage.id || tempId,
                  sending: false,
                  sent: true,
                  delivered: true,
                  createdAt: sentMessage.createdAt || msg.createdAt,
                }
              : msg
          )
        );
      }
    });

    socket.on("messageError", (data) => {
      const { tempId, error } = data;
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.tempId === tempId
            ? { ...msg, sending: false, error: true, errorMessage: error }
            : msg
        )
      );
    });

    // ⭐ WebRTC Socket Handlers
    socket.on("call:incoming", async ({ fromUserId, offer, callType: incomingCallType }) => {
      console.log("📞 Incoming call from:", fromUserId, "type:", incomingCallType);
      if (fromUserId === receiverId) {
        setIncomingOffer(offer);
        setIncomingCallerId(fromUserId);
        setIsIncomingCall(true);
        setCallType(incomingCallType || "audio");
      }
    });

    socket.on("call:answer", async ({ fromUserId, answer }) => {
      console.log("📥 Received answer from:", fromUserId);
      if (fromUserId === receiverId && peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
          console.log("✅ Remote description set from answer");
          
          // Add any pending ICE candidates
          if (pendingIceCandidates.current.length > 0) {
            console.log("➕ Adding", pendingIceCandidates.current.length, "pending ICE candidates");
            for (const candidate of pendingIceCandidates.current) {
              try {
                await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
              } catch (err) {
                console.error("Error adding pending ICE candidate:", err);
              }
            }
            pendingIceCandidates.current = [];
          }
        } catch (error) {
          console.error("❌ Error setting remote description:", error);
        }
      }
    });

    socket.on("ice-candidate", async ({ fromUserId, candidate }) => {
      console.log("📥 Received ICE candidate from:", fromUserId);
      if (fromUserId === receiverId) {
        if (peerConnectionRef.current && peerConnectionRef.current.remoteDescription) {
          try {
            await peerConnectionRef.current.addIceCandidate(
              new RTCIceCandidate(candidate)
            );
            console.log("✅ ICE candidate added");
          } catch (error) {
            console.error("❌ Error adding ICE candidate:", error);
          }
        } else {
          console.log("⏳ Storing ICE candidate for later");
          pendingIceCandidates.current.push(candidate);
        }
      }
    });

    socket.on("call:ended", ({ fromUserId }) => {
      console.log("📞 Call ended by:", fromUserId);
      if (fromUserId === receiverId) {
        endCall();
        Alert.alert("Call Ended", `${receiverName} ended the call`);
      }
    });

    return () => {
      console.log("🧹 Cleaning up vendor socket listeners");
      socket.off("newMessage");
      socket.off("messageDelivered");
      socket.off("messageSeen");
      socket.off("messagesRead");
      socket.off("messageSent");
      socket.off("messageError");
      socket.off("user:online");
      socket.off("user:offline");
      socket.off("user:status");
      socket.off("userTyping");
      socket.off("userStoppedTyping");
      socket.off("call:incoming");
      socket.off("call:answer");
      socket.off("ice-candidate");
      socket.off("call:ended");
      
      // Emit offline before disconnecting
      if (userId) {
        socket.emit("user:offline", { userId });
      }
      
      socket.disconnect();
      isInitialized.current = false;
    };
  }, [userId, roomId, receiverId, receiverName, debouncedMarkAsRead, endCall]);

  // Initialize screen
  useEffect(() => {
    if (!userId || !roomId) return;

    fetchMessages();
    const cleanup = setupSocketConnection();

    return () => {
      cleanup?.();
      endCall();
    };
  }, [userId, roomId, fetchMessages, setupSocketConnection]);

  // Keyboard listeners
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardWillShowListener?.remove();
      keyboardWillHideListener?.remove();
    };
  }, []);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  // Handle screen focus
  useFocusEffect(
    useCallback(() => {
      if (hasUnreadMessages.current) {
        debouncedMarkAsRead();
      }
      
      // Emit online status and check client status when screen is focused
      if (socketRef.current?.connected && userId) {
        socketRef.current.emit("user:online", { userId });
        if (receiverId) {
          socketRef.current.emit("user:checkStatus", { userId: receiverId });
        }
      }
      
      return () => {
        if (markAsReadTimeoutRef.current) {
          clearTimeout(markAsReadTimeoutRef.current);
        }
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      };
    }, [debouncedMarkAsRead, userId, receiverId])
  );

  // App state change handler
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "active") {
        if (hasUnreadMessages.current) {
          debouncedMarkAsRead();
        }
        if (socketRef.current?.connected && userId) {
          socketRef.current.emit("user:online", { userId });
          if (receiverId) {
            socketRef.current.emit("user:checkStatus", { userId: receiverId });
          }
        }
      } else if (nextAppState === "background" || nextAppState === "inactive") {
        if (socketRef.current?.connected && userId) {
          socketRef.current.emit("user:offline", { userId });
        }
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription?.remove();
  }, [debouncedMarkAsRead, userId, receiverId]);

  // Send message function
  const sendMessage = useCallback(() => {
    if (!input.trim() || !socketRef.current?.connected || !receiverId) {
      return;
    }

    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const messageData = {
      tempId,
      senderId: userId,
      receiverId: receiverId,
      roomId,
      message: input.trim(),
      createdAt: new Date().toISOString(),
      type: "text",
    };

    const optimisticMessage = {
      ...messageData,
      id: tempId,
      sent: false,
      delivered: false,
      seen: false,
      sending: true,
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setInput("");

    // Stop typing indicator
    if (isTyping) {
      setIsTyping(false);
      socketRef.current.emit("stopTyping", { roomId, senderId: userId });
    }

    socketRef.current.emit("sendMessage", messageData);

    // Fallback timeout
    setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.tempId === tempId && msg.sending
            ? { ...msg, sending: false, sent: true, error: false }
            : msg
        )
      );
    }, 5000);
  }, [input, userId, receiverId, roomId, isTyping]);

  // Retry message function
  const retryMessage = useCallback(
    (message) => {
      if (!socketRef.current?.connected) return;

      const newTempId = `retry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const messageData = {
        tempId: newTempId,
        senderId: userId,
        receiverId: receiverId,
        roomId,
        message: message.message,
        createdAt: new Date().toISOString(),
        type: "text",
      };

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.tempId === message.tempId || msg.id === message.id
            ? { ...msg, sending: true, error: false, tempId: newTempId }
            : msg
        )
      );

      socketRef.current.emit("sendMessage", messageData);
    },
    [userId, receiverId, roomId]
  );

  // Phone call handler
  const handlePhoneCall = useCallback(() => {
    if (!clientPhone) {
      Alert.alert(
        "No Phone Number",
        `${receiverName}'s phone number is not available.`
      );
      return;
    }

    Alert.alert(
      "Call Client",
      `Would you like to call ${receiverName} at ${clientPhone}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Call",
          onPress: () => {
            const phoneUrl = `tel:${clientPhone}`;
            Linking.canOpenURL(phoneUrl)
              .then((supported) => {
                if (supported) {
                  return Linking.openURL(phoneUrl);
                } else {
                  Alert.alert(
                    "Error",
                    "Phone app is not available on this device."
                  );
                }
              })
              .catch(() => {
                Alert.alert("Error", "Failed to open phone app.");
              });
          },
        },
      ]
    );
  }, [clientPhone, receiverName]);

  // Utility functions
  const formatTime = useCallback((timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const getMessageStatus = useCallback(
    (msg) => {
      if (msg.sending) return "Sending...";
      if (msg.error) return "Failed";
      if (msg.seen) return `Seen ${formatTime(msg.seenAt)}`;
      if (msg.delivered) return `Delivered ${formatTime(msg.createdAt)}`;
      if (msg.sent) return `Sent ${formatTime(msg.createdAt)}`;
      return formatTime(msg.createdAt);
    },
    [formatTime]
  );

  const formatDateLabel = useCallback((timestamp) => {
    if (!timestamp) return "";

    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return "Today";
    }

    if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    const daysDiff = Math.floor((today - messageDate) / (1000 * 60 * 60 * 24));
    if (daysDiff < 7) {
      return messageDate.toLocaleDateString("en-US", { weekday: "long" });
    }

    return messageDate.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }, []);

  // Group messages by date - memoized
  const groupedMessages = useMemo(() => {
    const grouped = [];
    let currentDate = null;
    let currentGroup = [];

    messages.forEach((message) => {
      const dateLabel = formatDateLabel(message.createdAt);

      if (dateLabel !== currentDate) {
        if (currentGroup.length > 0) {
          grouped.push({
            date: currentDate,
            messages: currentGroup,
          });
        }
        currentDate = dateLabel;
        currentGroup = [message];
      } else {
        currentGroup.push(message);
      }
    });

    if (currentGroup.length > 0) {
      grouped.push({
        date: currentDate,
        messages: currentGroup,
      });
    }

    return grouped;
  }, [messages, formatDateLabel]);

  // Render message item - memoized
  const renderMessageItem = useCallback(
    (msg, index) => {
      const isVendorMessage = msg.senderId === userId;

      return (
        <View
          key={msg.id || msg.tempId || index}
          className={isVendorMessage ? "items-end mb-5" : "items-start mb-5"}
        >
          <TouchableOpacity
            className={
              isVendorMessage
                ? "bg-primary rounded-xl px-4 py-2 max-w-[80%]"
                : "bg-white border border-[#E5E5E5] rounded-xl px-4 py-2 max-w-[80%]"
            }
            onPress={msg.error ? () => retryMessage(msg) : undefined}
            disabled={!msg.error}
            activeOpacity={msg.error ? 0.7 : 1}
          >
            <Text
              className={
                isVendorMessage
                  ? "text-white text-[14px]"
                  : "text-faintDark text-[14px]"
              }
              style={{ fontFamily: "poppinsRegular" }}
            >
              {msg.message}
            </Text>
            {msg.error && (
              <View className="flex-row items-center mt-1">
                <Ionicons name="alert-circle" size={12} color="#ff4444" />
                <Text className="text-sm text-[#ff4444] ml-1">
                  Tap to retry
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {isVendorMessage && (
            <Text
              className="text-sm text-[#A9A9A9] mt-1"
              style={{ fontFamily: "poppinsRegular" }}
            >
              {getMessageStatus(msg)}
            </Text>
          )}
        </View>
      );
    },
    [userId, retryMessage, getMessageStatus]
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#FFF8FB] items-center justify-center">
        <Text style={{ fontFamily: "poppinsRegular", fontSize: 16 }}>
          Loading messages...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#FFF8FB]">
      <StatusBar backgroundColor="#EB278D" barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View className="flex-1">
          {/* Header */}
          <View className="flex-row items-center bg-primary pt-[40px] pb-6 px-6">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="mr-2"
            >
              <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
            <View className="w-10 h-10 rounded-full bg-white items-center justify-center mr-3 overflow-hidden">
              <Image
                source={
                  chat?.client?.avatar
                    ? { uri: chat.client.avatar }
                    : require("../../../../assets/icon/avatar.png")
                }
                style={{ width: 36, height: 36 }}
                resizeMode="cover"
              />
            </View>
            <View className="flex-1">
              <Text
                className="text-white text-base font-semibold"
                style={{ fontFamily: "poppinsRegular" }}
                numberOfLines={1}
              >
                {receiverName}
              </Text>
              <View className="flex-row items-center mt-1">
                <Text
                  className="text-xs text-white"
                  style={{ fontFamily: "poppinsRegular" }}
                >
                  {/* ⭐ Show client's online status or typing indicator */}
                  {isReceiverTyping ? (
                    "typing..."
                  ) : isReceiverOnline ? (
                    <>
                      Online <Text className="text-[#00FF00]">•</Text>
                    </>
                  ) : receiverLastSeen ? (
                    formatLastSeen(receiverLastSeen)
                  ) : (
                    "Offline"
                  )}
                </Text>
              </View>
            </View>
            {/* ⭐ Call Buttons */}
            <View className="flex-row ml-4">
              {/* Phone Call (Regular) */}
              {clientPhone && (
                <TouchableOpacity onPress={handlePhoneCall} className="p-2 mr-2">
                  <Ionicons name="call-outline" size={24} color="#fff" />
                </TouchableOpacity>
              )}
              {/* Audio Call (VoIP) */}
              <TouchableOpacity
                onPress={() => startCall(false)}
                className="p-2 mr-2"
                disabled={!socketRef.current?.connected || isCallActive || !isReceiverOnline}
              >
                <Ionicons
                  name="call"
                  size={24}
                  color={
                    socketRef.current?.connected && !isCallActive && isReceiverOnline
                      ? "#fff"
                      : "#ffffff80"
                  }
                />
              </TouchableOpacity>
              {/* Video Call */}
              <TouchableOpacity
                onPress={() => startCall(true)}
                className="p-2"
                disabled={!socketRef.current?.connected || isCallActive || !isReceiverOnline}
              >
                <Ionicons
                  name="videocam"
                  size={24}
                  color={
                    socketRef.current?.connected && !isCallActive && isReceiverOnline
                      ? "#fff"
                      : "#ffffff80"
                  }
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Messages Container */}
          <View className="flex-1">
            {messages.length === 0 ? (
              <View className="flex-1 items-center justify-center px-8">
                <Text
                  className="text-gray-500 text-center text-base"
                  style={{ fontFamily: "poppinsRegular" }}
                >
                  No messages yet. Start a conversation with {receiverName}!
                </Text>
              </View>
            ) : (
              <ScrollView
                ref={scrollViewRef}
                className="flex-1 px-4 py-4"
                showsVerticalScrollIndicator={false}
                onScrollEndDrag={debouncedMarkAsRead}
                onMomentumScrollEnd={debouncedMarkAsRead}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ flexGrow: 1 }}
                removeClippedSubviews={true}
                maxToRenderPerBatch={50}
                windowSize={10}
                onContentSizeChange={() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }}
              >
                {groupedMessages.map((group, groupIndex) => (
                  <View key={groupIndex}>
                    <View className="items-center mb-4">
                      <View className="bg-[#F0F0F0] rounded-full px-4 py-1">
                        <Text
                          className="text-xs text-[#666]"
                          style={{ fontFamily: "poppinsRegular" }}
                        >
                          {group.date}
                        </Text>
                      </View>
                    </View>
                    {group.messages.map((msg, index) =>
                      renderMessageItem(msg, index)
                    )}
                  </View>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Input Container */}
          <View className="flex-row items-end px-4 pt-4 pb-10 bg-white border-t border-[#E5E5E5]">
            <View className="flex-1 max-h-[100px]">
              <TextInput
                ref={textInputRef}
                className="bg-[#F5F5F5] rounded-[8px] px-4 py-3 text-base"
                placeholder="Type message..."
                value={input}
                onChangeText={(text) => {
                  setInput(text);
                  handleTyping();
                }}
                style={{
                  fontFamily: "poppinsRegular",
                  minHeight: 40,
                  maxHeight: 100,
                  textAlignVertical: "center",
                }}
                multiline
                maxLength={1000}
                editable={
                  connectionStatus === "connected" &&
                  socketRef.current?.connected
                }
                onFocus={() => {
                  setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                  }, 300);
                }}
                blurOnSubmit={false}
                returnKeyType="default"
                onSubmitEditing={sendMessage}
              />
            </View>
            <TouchableOpacity
              className={`ml-3 rounded-full p-3 ${
                input.trim() &&
                connectionStatus === "connected" &&
                socketRef.current?.connected &&
                receiverId
                  ? "bg-primary"
                  : "bg-gray-300"
              }`}
              onPress={sendMessage}
              disabled={
                !input.trim() ||
                connectionStatus !== "connected" ||
                !socketRef.current?.connected ||
                !receiverId
              }
            >
              <Ionicons
                name="send"
                size={20}
                color={
                  input.trim() &&
                  connectionStatus === "connected" &&
                  socketRef.current?.connected &&
                  receiverId
                    ? "#fff"
                    : "#999"
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* ⭐ Incoming Call Modal */}
      <Modal
        visible={isIncomingCall}
        transparent={true}
        animationType="fade"
        onRequestClose={declineCall}
      >
        <View className="flex-1 bg-black/80 items-center justify-center">
          <View className="bg-white rounded-3xl p-8 w-[80%] items-center">
            <View className="w-24 h-24 rounded-full bg-primary/10 items-center justify-center mb-4 overflow-hidden">
              <Image
                source={
                  chat?.client?.avatar
                    ? { uri: chat.client.avatar }
                    : require("../../../../assets/icon/avatar.png")
                }
                style={{ width: 90, height: 90 }}
                resizeMode="cover"
              />
            </View>
            <Text
              className="text-xl font-semibold mb-2"
              style={{ fontFamily: "poppinsRegular" }}
            >
              {receiverName}
            </Text>
            <Text
              className="text-gray-500 mb-8"
              style={{ fontFamily: "poppinsRegular" }}
            >
              Incoming {callType} call...
            </Text>
            <View className="flex-row space-x-6">
              <TouchableOpacity
                onPress={declineCall}
                className="bg-red-500 rounded-full p-5"
              >
                <Ionicons name="close" size={32} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={answerCall}
                className="bg-green-500 rounded-full p-5"
              >
                <Ionicons name="call" size={32} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ⭐ Active Call Modal */}
      <Modal
        visible={isCallActive}
        animationType="fade"
        onRequestClose={endCall}
      >
        <View className="flex-1 bg-black">
          {/* Remote Video/Avatar */}
          {callType === "video" && remoteStream ? (
            <RTCView
              streamURL={remoteStream.toURL()}
              style={{ flex: 1 }}
              objectFit="cover"
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <View className="w-32 h-32 rounded-full bg-primary/20 items-center justify-center mb-6 overflow-hidden">
                <Image
                  source={
                    chat?.client?.avatar
                      ? { uri: chat.client.avatar }
                      : require("../../../../assets/icon/avatar.png")
                  }
                  style={{ width: 120, height: 120 }}
                  resizeMode="cover"
                />
              </View>
              <Text
                className="text-white text-2xl font-semibold mb-2"
                style={{ fontFamily: "poppinsRegular" }}
              >
                {receiverName}
              </Text>
              <Text
                className="text-white/70 text-lg"
                style={{ fontFamily: "poppinsRegular" }}
              >
                {formatCallDuration(callDuration)}
              </Text>
            </View>
          )}

          {/* Local Video (PiP) */}
          {callType === "video" && localStream && isVideoEnabled && (
            <View className="absolute top-12 right-4 w-32 h-48 rounded-xl overflow-hidden border-2 border-white shadow-lg">
              <RTCView
                streamURL={localStream.toURL()}
                style={{ flex: 1 }}
                objectFit="cover"
                mirror={true}
              />
            </View>
          )}

          {/* Call Duration Badge */}
          <View className="absolute top-12 left-4 bg-black/50 rounded-full px-4 py-2">
            <Text
              className="text-white text-sm"
              style={{ fontFamily: "poppinsRegular" }}
            >
              {formatCallDuration(callDuration)}
            </Text>
          </View>

          {/* Call Controls */}
          <View className="absolute bottom-12 left-0 right-0 px-8">
            <View className="flex-row justify-center space-x-6 mb-8">
              {/* Toggle Video */}
              {callType === "video" && (
                <TouchableOpacity
                  onPress={toggleVideo}
                  className={`rounded-full p-5 ${
                    isVideoEnabled ? "bg-white/20" : "bg-red-500"
                  }`}
                >
                  <Ionicons
                    name={isVideoEnabled ? "videocam" : "videocam-off"}
                    size={28}
                    color="#fff"
                  />
                </TouchableOpacity>
              )}

              {/* Toggle Mute */}
              <TouchableOpacity
                onPress={toggleMute}
                className={`rounded-full p-5 ${
                  isMuted ? "bg-red-500" : "bg-white/20"
                }`}
              >
                <Ionicons
                  name={isMuted ? "mic-off" : "mic"}
                  size={28}
                  color="#fff"
                />
              </TouchableOpacity>

              {/* Toggle Speaker */}
              <TouchableOpacity
                onPress={toggleSpeaker}
                className={`rounded-full p-5 ${
                  isSpeakerOn ? "bg-primary" : "bg-white/20"
                }`}
              >
                <Ionicons
                  name={isSpeakerOn ? "volume-high" : "volume-medium"}
                  size={28}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>

            {/* End Call Button */}
            <TouchableOpacity
              onPress={endCall}
              className="bg-red-500 rounded-full p-6 items-center justify-center mx-auto"
            >
              <Ionicons name="call" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}