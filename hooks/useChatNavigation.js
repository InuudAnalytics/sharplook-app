import { useCallback, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { chatConnectionService } from "../utils/chatConnectionService";

export const useChatNavigation = () => {
  const { user } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);

  const navigateToChat = useCallback(
    (navigation, chatParams, options = {}) => {
      const {
        roomId,
        receiverId,
        receiverName,
        vendorId,
        showLoading = false,
        onConnectionStart,
        onConnectionSuccess,
        onConnectionError,
      } = chatParams;

      let actualRoomId = roomId;
      let actualReceiverId = receiverId;

      if (vendorId && !roomId) {
        const userId = user?.id;
        if (userId) {
          actualRoomId = [userId, vendorId].sort().join("_");
          actualReceiverId = vendorId;
        }
      }

      if (chatParams.chat?.vendorId) {
        const userId = user?.id;
        if (userId) {
          actualRoomId = [userId, chatParams.chat.vendorId].sort().join("_");
          actualReceiverId = chatParams.chat.vendorId;
        }
      }

      if (!actualRoomId || !user?.id) {
        console.error("❌ Missing required parameters for chat navigation:", {
          roomId: actualRoomId,
          userId: user?.id,
          chatParams,
        });
        return;
      }

      navigation.navigate("ChatDetailScreen", {
        roomId: actualRoomId,
        receiverId: actualReceiverId,
        receiverName: receiverName || chatParams.chat?.name || "Chat",
        connectionEstablished: false,
        socket: null,
        vendorPhone: chatParams.vendorPhone,
        vendorAvatar: chatParams.vendorAvatar,
        ...options,
      });

      (async () => {
        try {
          setIsConnecting(true);

          if (onConnectionStart) {
            onConnectionStart();
          }

          const existingSocket = chatConnectionService.getSocket();

          if (existingSocket && chatConnectionService.isSocketConnected()) {
            if (onConnectionSuccess) {
              onConnectionSuccess({ socket: existingSocket });
            }
          } else {
            const connectionResult =
              await chatConnectionService.establishConnection(
                user.id,
                actualRoomId
              );

            if (onConnectionSuccess) {
              onConnectionSuccess(connectionResult);
            }
          }
        } catch (error) {
          console.error("❌ Background connection failed:", error);

          if (onConnectionError) {
            onConnectionError(error);
          }
        } finally {
          setIsConnecting(false);
        }
      })();
    },
    [user]
  );

  const navigateToChatOptimized = useCallback(
    (navigation, chatParams, options = {}) => {
      const {
        roomId,
        receiverId,
        receiverName,
        vendorId,
        vendorPhone,
        vendorAvatar,
      } = chatParams;

      let actualRoomId = roomId;
      let actualReceiverId = receiverId;

      if (vendorId && !roomId) {
        const userId = user?.id;
        if (userId) {
          actualRoomId = [userId, vendorId].sort().join("_");
          actualReceiverId = vendorId;
        }
      }

      if (chatParams.chat?.vendorId) {
        const userId = user?.id;
        if (userId) {
          actualRoomId = [userId, chatParams.chat.vendorId].sort().join("_");
          actualReceiverId = chatParams.chat.vendorId;
        }
      }

      if (!actualRoomId || !user?.id) {
        console.error("❌ Missing required parameters");
        return;
      }

      const existingSocket = chatConnectionService.getSocket();
      const isConnected =
        existingSocket && chatConnectionService.isSocketConnected();

      navigation.navigate("ChatDetailScreen", {
        roomId: actualRoomId,
        receiverId: actualReceiverId,
        receiverName: receiverName || chatParams.chat?.name || "Chat",
        connectionEstablished: isConnected,
        socket: isConnected ? existingSocket : null,
        vendorPhone: vendorPhone || chatParams.chat?.phoneNumber,
        vendorAvatar: vendorAvatar || chatParams.chat?.avatar,
        ...options,
      });

      if (!isConnected) {
        chatConnectionService
          .establishConnection(user.id, actualRoomId)
          .catch((error) => {
            console.warn("Background connection failed:", error);
          });
      }
    },
    [user]
  );

  const navigateToChatList = useCallback((navigation) => {
    navigation.navigate("ChatListScreen");
  }, []);

  return {
    navigateToChat: navigateToChatOptimized,
    navigateToChatOriginal: navigateToChat,
    navigateToChatList,
    isConnecting,
    isConnectedToRoom: chatConnectionService.isConnectedToRoom.bind(
      chatConnectionService
    ),
    getSocket: chatConnectionService.getSocket.bind(chatConnectionService),
    isSocketConnected: chatConnectionService.isSocketConnected.bind(
      chatConnectionService
    ),
  };
};

export const useFastChatNavigation = () => {
  const { user } = useAuth();

  const navigateToChat = useCallback(
    (navigation, chatParams, options = {}) => {
      const userId = user?.id;
      if (!userId) return;

      const {
        roomId,
        receiverId,
        vendorId,
        receiverName,
        vendorPhone,
        vendorAvatar,
      } = chatParams;

      let actualRoomId = roomId;
      let actualReceiverId = receiverId;

      if (vendorId && !roomId) {
        actualRoomId = [userId, vendorId].sort().join("_");
        actualReceiverId = vendorId;
      }

      if (!actualRoomId) return;

      navigation.navigate("ChatDetailScreen", {
        roomId: actualRoomId,
        receiverId: actualReceiverId,
        receiverName: receiverName || "Chat",
        connectionEstablished: false,
        socket: null,
        vendorPhone,
        vendorAvatar,
        ...options,
      });
    },
    [user?.id]
  );

  return { navigateToChat };
};
