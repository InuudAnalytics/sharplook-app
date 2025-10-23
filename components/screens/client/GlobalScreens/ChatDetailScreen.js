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
  StatusBar,
  Modal,
  Alert,
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

export default function ChatDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user, userId } = useAuth();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Call states
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
  const peerConnectionRef = useRef(null);
  const callTimerRef = useRef(null);

  // WebRTC Configuration
  const rtcConfiguration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  // Get route params - memoized to prevent re-computation
  const routeParams = useMemo(
    () => ({
      roomId: route.params.roomId,
      receiverName: route.params.receiverName || "Chat",
      connectionEstablished: route.params.connectionEstablished || false,
      preEstablishedSocket: route.params.socket,
      vendorPhone: route.params.vendorPhone,
      vendorAvatar: route.params.vendorAvatar,
      receiverId:
        route.params.receiverId ||
        getReceiverIdFromRoomId(route.params.roomId, userId),
    }),
    [route.params, userId]
  );

  const { roomId, receiverName, vendorPhone, vendorAvatar, receiverId } =
    routeParams;

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
      const response = await HttpClient.get(
        `/messages/user/getClientChatsList`
      );

      if (response.data.success && response.data.data) {
        const currentChat = response.data.data.find(
          (chat) => chat.roomId === roomId
        );

        if (currentChat && currentChat.messages) {
          const sortedMessages = currentChat.messages
            .map((msg) => ({
              ...msg,
              id: msg.id || `msg_${msg.createdAt}_${msg.senderId}`,
              sent: true,
              delivered: true,
              seen: msg.seen || false,
              seenAt: msg.seenAt || null,
              type: msg.type || "text",
            }))
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

          setMessages(sortedMessages);

          const unreadMessages = sortedMessages.filter(
            (msg) => msg.senderId !== userId && !msg.seen
          );

          if (unreadMessages.length > 0) {
            hasUnreadMessages.current = true;
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

  // ==================== WebRTC Functions ====================

  // Initialize local media stream
  const initializeLocalStream = useCallback(async (isVideoCall) => {
    try {
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: isVideoCall
          ? {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: "user",
            }
          : false,
      });

      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
      Alert.alert(
        "Media Error",
        "Could not access camera/microphone. Please check permissions."
      );
      return null;
    }
  }, []);

  // Create peer connection
  const createPeerConnection = useCallback(() => {
    const peerConnection = new RTCPeerConnection(rtcConfiguration);

    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socketRef.current?.connected) {
        socketRef.current.emit("ice-candidate", {
          toUserId: receiverId,
          fromUserId: userId,
          candidate: event.candidate,
        });
      }
    };

    peerConnection.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    peerConnection.onconnectionstatechange = () => {
      console.log("Connection state:", peerConnection.connectionState);
      if (
        peerConnection.connectionState === "disconnected" ||
        peerConnection.connectionState === "failed"
      ) {
        endCall();
      }
    };

    peerConnectionRef.current = peerConnection;
    return peerConnection;
  }, [receiverId, userId]);

  // Start outgoing call
  const startCall = useCallback(
    async (isVideoCall) => {
      try {
        if (!socketRef.current?.connected) {
          Alert.alert("Connection Error", "Please check your internet connection");
          return;
        }

        setCallType(isVideoCall ? "video" : "audio");
        setIsCallActive(true);
        setIsVideoEnabled(isVideoCall);

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
          peerConnection.addTrack(track, stream);
        });

        // Create and send offer
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        socketRef.current.emit("call:offer", {
          toUserId: receiverId,
          fromUserId: userId,
          offer: offer,
        });

        // Start call timer
        callTimerRef.current = setInterval(() => {
          setCallDuration((prev) => prev + 1);
        }, 1000);
      } catch (error) {
        console.error("Error starting call:", error);
        Alert.alert("Call Error", "Failed to start call");
        endCall();
      }
    },
    [receiverId, userId, initializeLocalStream, createPeerConnection]
  );

  // Answer incoming call
  const answerCall = useCallback(async () => {
    try {
      setIsIncomingCall(false);
      setIsCallActive(true);
      setIsVideoEnabled(callType === "video");

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
        peerConnection.addTrack(track, stream);
      });

      // Set remote description from incoming offer
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(incomingOffer)
      );

      // Create and send answer
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

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
      console.error("Error answering call:", error);
      Alert.alert("Call Error", "Failed to answer call");
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
    setIsIncomingCall(false);
    setIncomingOffer(null);
    setIncomingCallerId(null);
    
    if (socketRef.current?.connected) {
      socketRef.current.emit("call:end", {
        toUserId: incomingCallerId,
        fromUserId: userId,
      });
    }
  }, [incomingCallerId, userId]);

  // End call
  const endCall = useCallback(() => {
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
      localStream.getTracks().forEach((track) => track.stop());
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
  }, [localStream, receiverId, userId]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted((prev) => !prev);
    }
  }, [localStream]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStream && callType === "video") {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled((prev) => !prev);
    }
  }, [localStream, callType]);

  // Toggle speaker
  const toggleSpeaker = useCallback(() => {
    setIsSpeakerOn((prev) => !prev);
    // Note: Speaker toggle requires native module implementation
    // This is a placeholder for the UI state
  }, []);

  // Format call duration
  const formatCallDuration = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  // ==================== Socket Setup ====================

  const setupSocketConnection = useCallback(() => {
    if (!userId || !roomId || isInitialized.current) return;

    isInitialized.current = true;
    setConnectionStatus("connecting");

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
      setConnectionStatus("connected");
      socket.emit("join-room", roomId);
    });

    socket.on("disconnect", () => {
      setConnectionStatus("disconnected");
    });

    socket.on("reconnect", () => {
      setConnectionStatus("connected");
      socket.emit("join-room", roomId);
    });

    socket.on("connect_error", () => {
      setConnectionStatus("error");
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

    // ==================== WebRTC Socket Handlers ====================

    // Incoming call offer
    socket.on("call:incoming", async ({ fromUserId, offer }) => {
      if (fromUserId === receiverId) {
        setIncomingOffer(offer);
        setIncomingCallerId(fromUserId);
        setIsIncomingCall(true);
        
        // Determine call type from offer
        const hasVideo = offer.sdp.includes("m=video");
        setCallType(hasVideo ? "video" : "audio");
      }
    });

    // Call answer received
    socket.on("call:answer", async ({ fromUserId, answer }) => {
      if (fromUserId === receiverId && peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
        } catch (error) {
          console.error("Error setting remote description:", error);
        }
      }
    });

    // ICE candidate received
    socket.on("ice-candidate", async ({ fromUserId, candidate }) => {
      if (fromUserId === receiverId && peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        } catch (error) {
          console.error("Error adding ICE candidate:", error);
        }
      }
    });

    // Call ended by remote user
    socket.on("call:ended", ({ fromUserId }) => {
      if (fromUserId === receiverId) {
        endCall();
        Alert.alert("Call Ended", `${receiverName} ended the call`);
      }
    });

    return () => {
      socket.off("newMessage");
      socket.off("messageDelivered");
      socket.off("messageSeen");
      socket.off("messagesRead");
      socket.off("messageSent");
      socket.off("messageError");
      socket.off("call:incoming");
      socket.off("call:answer");
      socket.off("ice-candidate");
      socket.off("call:ended");
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

  // Handle screen focus to mark messages as read
  useFocusEffect(
    useCallback(() => {
      if (hasUnreadMessages.current) {
        debouncedMarkAsRead();
      }
      return () => {
        if (markAsReadTimeoutRef.current) {
          clearTimeout(markAsReadTimeoutRef.current);
        }
      };
    }, [debouncedMarkAsRead])
  );

  // App state change handler
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "active" && hasUnreadMessages.current) {
        debouncedMarkAsRead();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription?.remove();
  }, [debouncedMarkAsRead]);

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

    socketRef.current.emit("sendMessage", messageData);

    setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.tempId === tempId && msg.sending
            ? { ...msg, sending: false, sent: true, error: false }
            : msg
        )
      );
    }, 5000);
  }, [input, userId, receiverId, roomId]);

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
      const isOwn = msg.senderId === userId;
      return (
        <View
          key={msg.id || msg.tempId || index}
          className={isOwn ? "items-end mb-5" : "items-start mb-5"}
        >
          <TouchableOpacity
            className={
              isOwn
                ? "bg-primary rounded-xl px-4 py-2 max-w-[80%]"
                : "bg-white border border-[#E5E5E5] rounded-xl px-4 py-2 max-w-[80%]"
            }
            onPress={msg.error ? () => retryMessage(msg) : undefined}
            disabled={!msg.error}
            activeOpacity={msg.error ? 0.7 : 1}
          >
            <Text
              className={
                isOwn ? "text-white text-[14px]" : "text-faintDark text-[14px]"
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
          {isOwn && (
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
        <Text style={{ fontFamily: "poppinsRegular" }}>
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
                  vendorAvatar
                    ? { uri: vendorAvatar }
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
                  {connectionStatus === "connected" &&
                  socketRef.current?.connected ? (
                    <>
                      Online <Text className="text-[#00FF00]">•</Text>
                    </>
                  ) : connectionStatus === "connecting" ? (
                    "Connecting..."
                  ) : connectionStatus === "error" ? (
                    "Connection failed - Retrying..."
                  ) : (
                    "Offline"
                  )}
                </Text>
                {connectionStatus === "error" && (
                  <TouchableOpacity
                    onPress={() => {
                      if (socketRef.current) {
                        socketRef.current.connect();
                      }
                    }}
                    className="ml-2 bg-white/20 rounded-full px-2 py-1"
                  >
                    <Text
                      className="text-xs text-white"
                      style={{ fontFamily: "poppinsRegular" }}
                    >
                      Retry
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {/* Call Buttons */}
            <View className="flex-row ml-4">
              <TouchableOpacity
                onPress={() => startCall(false)}
                className="p-2 mr-2"
                disabled={!socketRef.current?.connected || isCallActive}
              >
                <Ionicons
                  name="call"
                  size={24}
                  color={
                    socketRef.current?.connected && !isCallActive
                      ? "#fff"
                      : "#ffffff80"
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => startCall(true)}
                className="p-2"
                disabled={!socketRef.current?.connected || isCallActive}
              >
                <Ionicons
                  name="videocam"
                  size={24}
                  color={
                    socketRef.current?.connected && !isCallActive
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
                  className="text-gray-500 text-center"
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
                className="bg-[#F5F5F5] rounded-[8px] px-4 py-3 text-sm"
                placeholder="Type message..."
                value={input}
                onChangeText={setInput}
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

      {/* Incoming Call Modal */}
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
                  vendorAvatar
                    ? { uri: vendorAvatar }
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

      {/* Active Call Modal */}
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
                    vendorAvatar
                      ? { uri: vendorAvatar }
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

          {/* Local Video (Picture-in-Picture) */}
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