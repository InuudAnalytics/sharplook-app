import React from "react";
import HomeScreen from "./HomeScreen";
import CategoriesScreen from "./CategoriesScreen";
import ChatListScreen from "../GlobalScreens/ChatListScreen";
import ChatDetailScreen from "../GlobalScreens/ChatDetailScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CartScreen from "../GlobalScreens/CartScreen";
import VendorProfileScreen from "../GlobalScreens/VendorProfileScreen";
import BookAppointmentScreen from "../GlobalScreens/BookAppointmentScreen";
import ProductReviewsScreen from "../reviews/ProductReview";
import OtherScreen from "./OtherScreen";
import ProductDetailsScreen from "../ProductDetailsScreen";
import ServiceDetailsScreen from "../ServiceDetailsScreen";
import VendorProfileProductDetailsScreen from "../VendorProfileProductDetailsScreen";
import VendorProfileServiceDetailsScreen from "../VendorProfileServiceDetailsScreen";
import AllVendorsScreen from "../Home/AllVendorScreen";


const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen
        name="ProductReviewsScreen"
        component={ProductReviewsScreen}
      />
      <Stack.Screen name="OtherScreen" component={OtherScreen} />
      <Stack.Screen name="ChatListScreen" component={ChatListScreen} />
      <Stack.Screen name="ChatDetailScreen" component={ChatDetailScreen} />
      <Stack.Screen name="AllVendorsScreen" component={AllVendorsScreen} />

      <Stack.Screen
        name="VendorProfileScreen"
        component={VendorProfileScreen}
      />
      <Stack.Screen
        name="BookAppointmentScreen"
        component={BookAppointmentScreen}
      />
      <Stack.Screen
        name="ProductDetailsScreen"
        component={ProductDetailsScreen}
      />
      <Stack.Screen
        name="ServiceDetailsScreen"
        component={ServiceDetailsScreen}
      />
      <Stack.Screen
        name="VendorProfileProductDetailsScreen"
        component={VendorProfileProductDetailsScreen}
      />
      <Stack.Screen
        name="VendorProfileServiceDetailsScreen"
        component={VendorProfileServiceDetailsScreen}
      />
    </Stack.Navigator>
  );
}
