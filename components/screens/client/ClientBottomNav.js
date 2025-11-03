import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";
import {
  MaterialIcons,
  Ionicons,
  FontAwesome5,  // CHANGED from FontAwesome6
  AntDesign,
} from "@expo/vector-icons";
import HomeStack from "./Home/HomeStack";
import MarketStack from "./Market/MarketStack";
import BookingStack from "./Booking/BookingStack";
import NotificationStack from "./Notification/NotificationStack";
import ProfileStack from "./Profile/ProfileStack";

const Tab = createBottomTabNavigator();

export default function ClientBottomNav() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          if (route.name === "Home") {
            return (
              <FontAwesome5 name="fire" size={24} color={color} />  // CHANGED
            );
          } else if (route.name === "Market") {
            return <FontAwesome5 name="store" size={size} color={color} />;  // CHANGED
          } else if (route.name === "Bookings") {
            return <MaterialIcons name="event" size={size} color={color} />;
          } else if (route.name === "Notification") {
            return (
              <Ionicons
                name="notifications-outline"
                size={size}
                color={color}
              />
            );
          } else if (route.name === "Profile") {
            return <AntDesign name="user" size={24} color={color} />;
          }
        },
        tabBarActiveTintColor: "#EB278D",
        tabBarInactiveTintColor: "#00000099",
        tabBarStyle: { backgroundColor: "#FFFAFD", borderTopWidth: 0 },
        tabBarPressColor: "#EB278D",
        tabBarPressOpacity: 0.7,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Market" component={MarketStack} />
      <Tab.Screen name="Bookings" component={BookingStack} />
      <Tab.Screen name="Notification" component={NotificationStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}