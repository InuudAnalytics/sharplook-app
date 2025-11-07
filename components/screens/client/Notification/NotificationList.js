import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { HttpClient } from "../../../../api/HttpClient";
import EmptySVG from "../../../../assets/img/empty.svg";
import {
  getRelativeTime,
  groupNotificationsByAge,

} from "../../../reusuableComponents/RelativeTime";
import Bell from "../../../../assets/icon/bell.svg"

export default function NotificationList() {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchNotifications = async () => {
        setLoading(true);
        try {
          const res = await HttpClient.get("/notifications/getNotifications");
          const data = res?.data?.data || [];

          // Ensure data is an array and has the correct structure for SectionList
          if (Array.isArray(data)) {
            // Use the new grouping function to organize notifications by age
            const groupedNotifications = groupNotificationsByAge(data);
            setNotifications(groupedNotifications);
          } else {
            setNotifications([]);
          }
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
        <StatusBar backgroundColor="#EB278D" barStyle="light-content" />
        <View
          style={{
            backgroundColor: "#EB278D",
            paddingTop: 60,
            paddingBottom: 16,
            alignItems: "center",
          }}
        >
          <Text
            style={{ color: "#fff", fontSize: 18, fontFamily: "poppinsMedium" }}
          >
            Notifications
          </Text>
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

  // Check if notifications array is empty or has no data
  const hasNotifications =
    notifications &&
    notifications.length > 0 &&
    notifications.some((section) => section.data && section.data.length > 0);

  if (!loading && !hasNotifications) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FFFAFD" }}>
        <View
          style={{
            backgroundColor: "#EB278D",
            paddingTop: 60,
            paddingBottom: 16,
            alignItems: "center",
          }}
        >
          <Text
            style={{ color: "#fff", fontSize: 18, fontFamily: "poppinsMedium" }}
          >
            Notifications
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
            marginTop: -30,
          }}
        >
          <EmptySVG width={120} height={120} />
          <Text
            className="text-faintDark"
            style={{
              fontFamily: "poppinsRegular",
              fontSize: 16,
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
      <View
        style={{
          backgroundColor: "#EB278D",
          paddingTop: 60,
          paddingBottom: 16,
          alignItems: "center",
        }}
      >
        <Text
          style={{ color: "#fff", fontSize: 18, fontFamily: "poppinsMedium" }}
        >
          Notifications
        </Text>
      </View>
      <SectionList
        sections={notifications}
        keyExtractor={(item, index) => item.id || `notification-${index}`}
        renderSectionHeader={({ section: { title } }) => (
          <Text
            style={{
              fontSize: 18,
              fontFamily: "LatoBold",
              marginTop: 24,
              marginLeft: 20,
            }}
          >
            {title}
          </Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.notificationItem}
            onPress={() =>
              navigation.navigate("NotificationDetailScreen", {
                notification: item,
                id: item.id,
              })
            }
          >
            <View style={styles.iconContainer}>
              {item.icon ? (
                item.icon
              ) : (
                <Bell
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
    fontSize: 17,
    color: "#222",
    fontFamily: "poppinsRegular",
  },
  timeText: {
    fontSize: 15,
    color: "#888",
    marginLeft: 8,
    minWidth: 70,
    textAlign: "right",
  },
});
