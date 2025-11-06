import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";
import {
  MaterialIcons,
  Ionicons,
  FontAwesome5,
  FontAwesome,
  AntDesign,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import DashboardScreen from "./Dashboard/DashboardScreen";
import MyProductsScreen from "./MyProductsScreen";
import VendorBookingsScreen from "./VendorBookingsScreen";
import VendorProfileScreen from "./VendorProfileScreen";
import MyServicesScreen from "./MyServicesScreen";
import DashboardStack from "./Dashboard/DashboardStack";

import User from '../../../assets/icon/user.svg'
import Services from '../../../assets/icon/smile.svg'
import Products from '../../../assets/icon/archive.svg'
import Bookings from '../../../assets/icon/calendar.svg'
import Dashboard from '../../../assets/icon/home.svg'

const Tab = createBottomTabNavigator();

export default function VendorBottomNav() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          if (route.name === "Dashboard") {
            return <Dashboard name="dashboard" size={size} color={color} />;
          } else if (route.name === "Bookings") {
            return <Bookings name="event" size={size} color={color} />;
          } else if (route.name === "My Products") {
            return <Products name="inventory" size={size} color={color} />;
          } else if (route.name === "My Services") {
            return <Services name="face" size={size} color={color} />;
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
      <Tab.Screen name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="Bookings" component={VendorBookingsScreen} />
      <Tab.Screen name="My Products" component={MyProductsScreen} />
      <Tab.Screen name="My Services" component={MyServicesScreen} />
      <Tab.Screen name="Profile" component={VendorProfileScreen} />
    </Tab.Navigator>
  );
}
