import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { HttpClient } from "../../../api/HttpClient";
import EmptySVG from "../../../assets/img/empty.svg";
import { DateConverter } from "../../reusuableComponents/DateConverter";
import { getRelativeTime } from "../../reusuableComponents/RelativeTime";
import Left from '../../../assets/icon/left.svg'

export default function NotificationList() {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to convert flat array to sections format
  const convertToSections = (notifications) => {
    if (!notifications || !Array.isArray(notifications)) {
      return [];
    }

    // Group notifications by date or create a single section
    const today = new Date();
    const todayStr = today.toDateString();

    // For now, let's create a single section with all notifications
    // You can modify this logic based on your API response structure
    return [
      {
        title: "Recent Notifications",
        data: notifications,
      },
    ];
  };

  useFocusEffect(
    useCallback(() => {
      const fetchNotifications = async () => {
        setLoading(true);
        try {
          const res = await HttpClient.get("/notifications/getNotifications");
          const notificationsData = res.data?.data || [];
          const sections = convertToSections(notificationsData);
          setNotifications(sections);
        } catch (error) {
          console.error("Error fetching notifications:", error);
          setNotifications([]);
        } finally {
          setLoading(false);
        }
      };
      fetchNotifications();
    }, [])
  );

  if (loading) {
    // Skeleton loader for notifications (no section headers)
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#FFFAFD",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#EB278D",
            paddingTop: 60,
            paddingBottom: 16,
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontFamily: "poppinsMedium",
            }}
          >
            Notifications
          </Text>
          <View style={{ width: 26 }} />
        </View>

        <View style={{ paddingHorizontal: 0, paddingTop: 16 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <View key={i} style={styles.notificationItem}>
              <View style={styles.iconContainer}>
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: "#e0e0e0",
                  }}
                />
              </View>
              <View style={{ flex: 1, justifyContent: "center" }}>
                <View
                  style={{
                    height: 14,
                    width: "80%",
                    backgroundColor: "#e0e0e0",
                    borderRadius: 4,
                    marginBottom: 6,
                  }}
                />
              </View>
              <View
                style={{
                  height: 10,
                  width: 40,
                  backgroundColor: "#e0e0e0",
                  borderRadius: 4,
                  alignSelf: "center",
                }}
              />
            </View>
          ))}
        </View>
      </View>
    );
  }

  // Empty state for no notifications
  if (!loading && (!notifications || notifications.length === 0)) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FFFAFD" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#EB278D",
            paddingTop: 60,
            paddingBottom: 16,
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Left name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontFamily: "poppinsMedium",
            }}
          >
            Notifications
          </Text>
          <View style={{ width: 26 }} />
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
            marginTop: -30, // Adjust this value to move content up and compensate for header
          }}
        >
          <EmptySVG width={120} height={120} />
          <Text
            className="text-faintDark"
            style={{
              fontFamily: "poppinsRegular",
              fontSize: 14,
              marginTop: 16,
              textAlign: "center",
            }}
          >
            Oops! You have no notification
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFAFD" }}>
      <StatusBar barStyle="light-content" backgroundColor={"#EB278D"} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#EB278D",
          paddingTop: 60,
          paddingBottom: 16,
          paddingHorizontal: 20,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text
          style={{
            color: "#fff",
            fontSize: 16,
            fontFamily: "poppinsMedium",
          }}
        >
          Notifications
        </Text>
        <View style={{ width: 26 }} />
      </View>
      <SectionList
        sections={notifications}
        keyExtractor={(item, index) =>
          item.id?.toString?.() || `notification-${index}`
        }
        renderSectionHeader={({ section: { title } }) => (
          <Text
            style={{
              fontSize: 16,
              fontFamily: "LatoBold",
              marginTop: 24,
              marginLeft: 20,
              marginBottom: 8,
            }}
          >
            {title}
          </Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.notificationItem}
            onPress={() =>
              navigation.navigate("VendorNotificationDetailScreen", {
                notification: item,
              })
            }
          >
            <View style={styles.iconContainer}>
              {/* Render icon if present, fallback to default */}
              {item.icon ? (
                item.icon
              ) : (
                <Ionicons
                  name="notifications-outline"
                  size={28}
                  color="#EB278D"
                />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text
                className="text-[16px] opacity-60"
                style={{ fontFamily: "latoRegular" }}
              >
                {item.message}
              </Text>
            </View>
            <Text
              className="text-[12px] opacity-60 mt-1"
              style={{ fontFamily: "latoRegular" }}
            >
              {getRelativeTime(item.createdAt)}
            </Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => (
          <View
            style={{ height: 1, backgroundColor: "#eee", marginLeft: 72 }}
          />
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  notificationItem: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#FFFAFD",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F8BBD0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  notificationText: {
    fontSize: 15,
    color: "#222",
    fontFamily: "poppinsRegular",
  },
  timeText: {
    fontSize: 13,
    color: "#888",
    marginLeft: 8,
    minWidth: 70,
    textAlign: "right",
  },
});
