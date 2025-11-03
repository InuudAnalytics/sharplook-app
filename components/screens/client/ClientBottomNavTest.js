import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  MaterialIcons,
  Ionicons,
  FontAwesome5,  // CHANGED from FontAwesome6
  AntDesign,
} from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const PlaceholderScreen = ({ route }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{route?.name} Screen</Text>
    <Text style={styles.subtitle}>Placeholder working</Text>
  </View>
);

export default function ClientBottomNavTest() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          if (route.name === "Home") {
            return <FontAwesome5 name="fire" size={24} color={color} />;  // CHANGED icon name
          } else if (route.name === "Market") {
            return <FontAwesome5 name="store" size={size} color={color} />;  // CHANGED icon name
          } else if (route.name === "Bookings") {
            return <MaterialIcons name="event" size={size} color={color} />;
          } else if (route.name === "Notification") {
            return <Ionicons name="notifications-outline" size={size} color={color} />;
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
      <Tab.Screen name="Home" component={PlaceholderScreen} />
      <Tab.Screen name="Market" component={PlaceholderScreen} />
      <Tab.Screen name="Bookings" component={PlaceholderScreen} />
      <Tab.Screen name="Notification" component={PlaceholderScreen} />
      <Tab.Screen name="Profile" component={PlaceholderScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EB278D',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});