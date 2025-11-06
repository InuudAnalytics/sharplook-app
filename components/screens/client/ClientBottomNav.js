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
import Home from "../../../assets/icon/home.svg"
import Bag from "../../../assets/icon/bag.svg"
import Calendar from "../../../assets/icon/calendar2.svg"
import Bell from "../../../assets/icon/bell.svg"
import User from "../../../assets/icon/user.svg"

const Tab = createBottomTabNavigator();

export default function ClientBottomNav() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          if (route.name === "Home") {
            return (
              <Home name="fire" size={24} color={color} /> 
            );
          } else if (route.name === "Market") {
            return <Bag name="store" size={size} color={color} />;  // CHANGED
          } else if (route.name === "Bookings") {
            return <Calendar name="event" size={size} color={color} />;
          } else if (route.name === "Notification") {
            return (
              <Bell
                name="notifications-outline"
                size={size}
                color={color}
              />
            );
          } else if (route.name === "Profile") {
            return <User name="user" size={24} color={color} />;
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