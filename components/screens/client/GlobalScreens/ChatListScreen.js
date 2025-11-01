import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../../../context/AuthContext";
import { io } from "socket.io-client";
import { HttpClient } from "../../../../api/HttpClient";
import { EmptyData } from "../../../reusuableComponents/EmptyData";
import { ChatTimestamp } from "../../../reusuableComponents/ChatTimestamp";
import { useChatNavigation } from "../../../../hooks/useChatNavigation";

export default function ChatListScreen() {
  const navigation = useNavigation();
  const { user, isLoading: authLoading } = useAuth();
  const socketRef = useRef(null);
  const [chats, setChats] = useState([]);
  const [chatPreviews, setChatPreviews] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { navigateToChat } = useChatNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  
  // ⭐ New state for unread counts per chat
  const [unreadCounts, setUnreadCounts] = useState({});
  
  const userId = user.id;

  // Hide bottom tab bar when this screen is focused
  useFocusEffect(
    React.useCallback(() => {
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

  // Update chat preview when new message is received
  const updateChatPreview = (newMessage) => {
    setChatPreviews((prevPreviews) => {
      const updatedPreviews = { ...prevPreviews };

      if (updatedPreviews[newMessage.roomId]) {
        updatedPreviews[newMessage.roomId] = {
          ...updatedPreviews[newMessage.roomId],
          lastMessage: {
            message: newMessage.message,
            createdAt: newMessage.createdAt,
            senderId: newMessage.senderId,
          },
          message: newMessage.message,
          time: newMessage.createdAt,
          senderId: newMessage.senderId,
        };
      } else {
        updatedPreviews[newMessage.roomId] = {
          roomId: newMessage.roomId,
          lastMessage: {
            message: newMessage.message,
            createdAt: newMessage.createdAt,
            senderId: newMessage.senderId,
          },
          message: newMessage.message,
          time: newMessage.createdAt,
          senderId: newMessage.senderId,
        };
      }

      return updatedPreviews;
    });

    // ⭐ Update unread count if message is from another user
    if (newMessage.senderId !== userId) {
      setUnreadCounts((prevCounts) => ({
        ...prevCounts,
        [newMessage.roomId]: (prevCounts[newMessage.roomId] || 0) + 1,
      }));
    }

    // Update the chats list to move the updated chat to the top
    setChats((prevChats) => {
      const updatedChats = [...prevChats];
      const chatIndex = updatedChats.findIndex(
        (chat) => chat.roomId === newMessage.roomId
      );

      if (chatIndex !== -1) {
        const chat = updatedChats.splice(chatIndex, 1)[0];
        updatedChats.unshift(chat);
      }

      return updatedChats;
    });
  };

  // ⭐ Fetch unread counts for all chats
  const fetchUnreadCounts = async () => {
    if (!userId) return;
    
    try {
      const response = await HttpClient.get("/messages/client/unread-by-room");
      
      if (response.data.success && response.data.data.unreadByRoom) {
        const countsMap = {};
        response.data.data.unreadByRoom.forEach((item) => {
          countsMap[item.roomId] = item.unreadCount;
        });
        setUnreadCounts(countsMap);
      }
    } catch (error) {
      console.error("Error fetching unread counts:", error);
    }
  };

  // Fetch chat list from backend
  const fetchChats = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    
    try {
      const [chatlistRes, chatPreviewRes] = await Promise.all([
        HttpClient.get(`/messages/user/getClientChatsList`),
        HttpClient.get(`/messages/client/previews`),
      ]);
      
      setChats(chatlistRes.data.data || []);

      // Create a map of chat previews by roomId
      const previewsMap = {};
      if (chatPreviewRes.data.data) {
        chatPreviewRes.data.data.forEach((preview) => {
          previewsMap[preview.roomId] = preview;
        });
      }
      setChatPreviews(previewsMap);
      
      // ⭐ Fetch unread counts after getting chats
      await fetchUnreadCounts();
      
    } catch (err) {
      setError("Failed to load chats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchChats();
      socketRef.current = io("https://sharplook-backend-zd8j.onrender.com", {
        query: { userId },
        transports: ["websocket"],
      });

      // Listen for new messages to update chat list
      socketRef.current.on("newMessage", (msg) => {
        updateChatPreview(msg);
      });

      // Listen for message sent confirmations
      socketRef.current.on("messageSent", (data) => {
        if (data.message) {
          updateChatPreview(data.message);
        }
      });

      // ⭐ Listen for messages read event to update unread count
      socketRef.current.on("messagesRead", ({ roomId, userId: readUserId }) => {
        // If someone else read messages in a room we're viewing, update count
        if (readUserId === userId) {
          setUnreadCounts((prevCounts) => ({
            ...prevCounts,
            [roomId]: 0,
          }));
        }
      });

      // ⭐ Listen for unread count updates (real-time)
      socketRef.current.on("unreadCountUpdate", ({ roomId, unreadCount }) => {
        if (roomId) {
          setUnreadCounts((prevCounts) => ({
            ...prevCounts,
            [roomId]: unreadCount,
          }));
        }
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("newMessage");
        socketRef.current.off("messageSent");
        socketRef.current.off("messagesRead");
        socketRef.current.off("unreadCountUpdate");
        socketRef.current.disconnect();
      }
    };
  }, [userId]);

  // Refresh chat list when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        fetchChats();
      }
    }, [userId])
  );

  if (authLoading || loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#FFF8FB] items-center justify-center">
        <Text style={{ fontFamily: "poppinsRegular" }}>Loading chats...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-[#FFF8FB] items-center justify-center">
        <Text style={{ fontFamily: "poppinsRegular", color: "red" }}>
          {error}
        </Text>
        <TouchableOpacity
          onPress={fetchChats}
          className="mt-4 bg-primary px-4 py-2 rounded"
        >
          <Text style={{ color: "#fff", fontFamily: "poppinsRegular" }}>
            Retry
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const filteredChats = chats.filter((chat) => {
    const vendorName = chat?.vendor?.name?.toLowerCase() || "";
    const lastMessage =
      chatPreviews[chat.roomId]?.lastMessage?.message ||
      chatPreviews[chat.roomId]?.message ||
      chat.lastMessage ||
      chat.message ||
      "";

    return (
      vendorName.includes(searchQuery.toLowerCase()) ||
      lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <SafeAreaView className="flex-1 bg-[#FFF8FB]">
      <StatusBar backgroundColor="#EB278D" barStyle="light-content" />
      <View className="bg-primary pb-6 pt-[60px] flex-row items-center justify-between px-4">
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="pr-4"
          style={{ minWidth: 40, alignItems: "flex-start" }}
        >
          <MaterialIcons name="chevron-left" size={32} color="#fff" />
        </TouchableOpacity>
        {/* Title */}
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text
            className="text-white text-[16px]"
            style={{ fontFamily: "poppinsMedium" }}
          >
            My Chats
          </Text>
        </View>
        {/* Right Spacer */}
        <View style={{ minWidth: 40 }} />
      </View>

      <View className="px-4 mt-4">
        <View className="flex-row items-center bg-white border border-[#F9BCDC] rounded-xl px-4 pt-3 pb-2">
          <MaterialIcons name="search" size={24} color="#8c817a" />
          <TextInput
            className="ml-2 text-sm flex-1"
            placeholder="Search messages"
            cursorColor="#BF6A37"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ fontFamily: "poppinsRegular" }}
          />
        </View>
      </View>

      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.id?.toString()}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24 }}
        renderItem={({ item }) => {
          const preview = chatPreviews[item.roomId];
          const lastMessage =
            preview?.lastMessage?.message ||
            preview?.message ||
            item.lastMessage ||
            item.message;
          const messageTimestamp =
            preview?.lastMessage?.createdAt || preview?.time || item.time;

          // Check if the message is from the current user
          const isOwnMessage =
            preview?.lastMessage?.senderId === userId ||
            preview?.senderId === userId ||
            item?.senderId === userId;

          // ⭐ Get unread count for this chat
          const unreadCount = unreadCounts[item.roomId] || 0;

          return (
            <TouchableOpacity
              className="flex-row border-b border-[#E5E5E5] items-center pb-3 mb-4"
              onPress={() => {
                // ⭐ Reset unread count when opening chat
                setUnreadCounts((prevCounts) => ({
                  ...prevCounts,
                  [item.roomId]: 0,
                }));
                
                navigateToChat(navigation, {
                  roomId: item.roomId,
                  receiverName: item?.vendor?.name,
                  receiverId: item?.vendor?.id,
                  vendorPhone: item?.vendor?.phoneNumber,
                  vendorAvatar: item?.vendor?.avatar,
                });
              }}
            >
              {/* Avatar */}
              <View className="w-14 h-14 border border-pinklight rounded-full bg-white items-center justify-center mr-4 overflow-hidden">
                <Image
                  source={
                    item?.vendor?.avatar
                      ? { uri: item?.vendor?.avatar }
                      : require("../../../../assets/icon/avatar.png")
                  }
                  style={{ width: 48, height: 48 }}
                  resizeMode="cover"
                />
              </View>

              {/* Chat Info */}
              <View className="flex-1 pb-3">
                <View className="flex-row items-center justify-between mb-1">
                  <Text
                    className="text-lg font-semibold text-faintDark flex-1"
                    style={{ fontFamily: "poppinsRegular" }}
                    numberOfLines={1}
                  >
                    {item?.vendor?.name}
                  </Text>
                  
                  {/* ⭐ Unread Badge - positioned next to name */}
                  {unreadCount > 0 && (
                    <View 
                      className="ml-2 min-w-[30px] h-[22px] rounded-full bg-red-600 items-center justify-center px-1.5"
                      style={{
                        shadowColor: "#EB278D",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.2,
                        shadowRadius: 1.5,
                        elevation: 3,
                      }}
                    >
                      <Text 
                        className="text-[18px] text-white font-bold"
                        style={{ fontFamily: "poppinsSemiBold" }}
                      >
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Last Message */}
                <Text
                  numberOfLines={1}
                  className={`text-sm mt-1 ${
                    unreadCount > 0 ? "text-faintDark font-semibold" : "text-[#A9A9A9]"
                  }`}
                  style={{ 
                    fontFamily: unreadCount > 0 ? "poppinsSemiBold" : "poppinsRegular" 
                  }}
                >
                  {isOwnMessage && lastMessage ? (
                    <>
                      <Text style={{ fontFamily: "poppinsBold" }}>me: </Text>
                      {lastMessage}
                    </>
                  ) : (
                    lastMessage || "No messages yet"
                  )}
                </Text>
              </View>

              {/* Timestamp */}
              <View className="ml-2">
                <ChatTimestamp timestamp={messageTimestamp} />
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<EmptyData msg="No chats found" />}
      />
    </SafeAreaView>
  );
}