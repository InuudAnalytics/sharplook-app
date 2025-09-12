import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ClientBottomNav from "./ClientBottomNav";
import CustomDrawerContent from "./CustomDrawerContent";
import { Ionicons } from "@expo/vector-icons";
import FilterScreen from "./FilterScreen";
import ChatListScreen from "./GlobalScreens/ChatListScreen";
import ChatDetailScreen from "./GlobalScreens/ChatDetailScreen";
import DebitCardPaymentForm from "./DebitCardPaymentForm";
import AddNewCardForm from "./AddNewCardForm";
import Search from "./Search";
import BookAppointmentScreen from "./GlobalScreens/BookAppointmentScreen";
import BookingDetailScreen from "./Booking/BookingDetailScreen";
import SettingsScreen from "./Profile/SettingsScreen";
import HelpSupportScreen from "./Profile/HelpSupportScreen";
import LegalScreen from "./Profile/LegalScreen";
import AddReviewScreen from "./reviews/AddReviewScreen";
import ReferAndEarnScreen from "./ReferAndEarnScreen";
import ReviewsScreen from "./reviews/ReviewsScreen";
import OfferPriceScreen from "./Booking/OfferPriceScreen";
import VendorPortfolioScreen from "./GlobalScreens/VendorPortfolioScreen";
import ClientWithdrawScreen from "./ClientWithdrawScreen";
import FundClientWalletScreen from "./FundClientWallet";
import BookingHomeServiceAppointScreen from "./GlobalScreens/bookingHomeserviceappointscreen";
import AddProductReviewScreen from "./reviews/AddProductReview";
import AddServiceReviewScreen from "./reviews/AddServiceReview";
import ServiceReviewsScreen from "./reviews/ServiceReview";
import ProductReviewsScreen from "./reviews/ProductReview";
import ProductDetailsScreen from "./ProductDetailsScreen";
import ServiceDetailsScreen from "./ServiceDetailsScreen";
import VendorProfileProductDetailsScreen from "./VendorProfileProductDetailsScreen";
import VendorProfileServiceDetailsScreen from "./VendorProfileServiceDetailsScreen";
import BookingStack from "./Booking/BookingStack";
import NotificationStack from "./Notification/NotificationStack";
import ProfileStack from "./Profile/ProfileStack";
import WalletStack from "./WalletStack";
import ClientOfferStack from "./MyOffers/ClientOfferStack";
import MyOrderStack from "./MyOrder/MyOrderStack";
import EditProfileScreen from "./Profile/EditProfileScreen";

const Drawer = createDrawerNavigator();

export default function ClientNavigator() {
  return (
    <>
      <Drawer.Navigator
        initialRouteName="Main"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: { backgroundColor: "#d6c0ad", width: 300 },
          drawerActiveTintColor: "#ED2584",
          drawerInactiveTintColor: "#3c2a1e",
          drawerLabelStyle: { fontFamily: "poppinsRegular", fontSize: 16 },
          swipeEnabled: false,
          drawerPosition: "right",
        }}
      >
        <Drawer.Screen
          name="Main"
          component={ClientBottomNav}
          options={{ drawerItemStyle: { display: "none" } }}
        />

        <Drawer.Screen
          name="Account Information"
          component={ProfileStack}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
  name="EditProfileScreen"
  component={EditProfileScreen}
  options={{ drawerItemStyle: { display: "none" }, headerShown: false }}
/>


        <Drawer.Screen
          name="My Bookings"
          component={BookingStack}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="calendar-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="My Offers"
          component={ClientOfferStack}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="pricetag-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="My Orders"
          component={MyOrderStack}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="receipt-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="SharpPay"
          component={WalletStack}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="wallet-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Refer and Earn"
          component={ReferAndEarnScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="gift-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />

        {/* ScreenSTacks */}

        <Drawer.Screen
          name="Notification"
          component={NotificationStack}
          options={{ drawerItemStyle: { display: "none" } }}
        />

        <Drawer.Screen
          name="HelpSupportScreen"
          component={HelpSupportScreen}
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="LegalScreen"
          component={LegalScreen}
          options={{ drawerItemStyle: { display: "none" } }}
        />

        <Drawer.Screen
          name="VendorPortfolioScreen"
          component={VendorPortfolioScreen}
          options={{ drawerItemStyle: { display: "none" } }}
        />

        <Drawer.Screen
          name="Filter"
          component={FilterScreen}
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="ChatListScreen"
          component={ChatListScreen}
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="ChatDetailScreen"
          component={ChatDetailScreen}
          options={{ drawerItemStyle: { display: "none" } }}
        />

        <Drawer.Screen
          name="DebitCardScreen"
          component={DebitCardPaymentForm}
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="AddNewCardScreen"
          component={AddNewCardForm}
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="Search"
          component={Search}
          options={{ drawerItemStyle: { display: "none" } }}
        />

        <Drawer.Screen
          name="BookAppointmentScreen"
          component={BookAppointmentScreen}
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="BookingDetailScreen"
          component={BookingDetailScreen}
          options={{ drawerItemStyle: { display: "none" } }}
        />

        <Drawer.Screen
          name="ReviewsScreen"
          component={ReviewsScreen}
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="AddReviewScreen"
          component={AddReviewScreen}
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="AddProductReviewScreen"
          component={AddProductReviewScreen}
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="AddServiceReviewScreen"
          component={AddServiceReviewScreen}
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="ServiceReviewScreen"
          component={ServiceReviewsScreen}
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="ProductReviewScreen"
          component={ProductReviewsScreen}
          options={{ drawerItemStyle: { display: "none" } }}
        />

        <Drawer.Screen
          name="ClientWithdrawScreen"
          component={ClientWithdrawScreen}
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="FundClientWallet"
          component={FundClientWalletScreen}
          options={{ drawerItemStyle: { display: "none" } }}
        />

        <Drawer.Screen
          name="OfferPriceScreen"
          component={OfferPriceScreen}
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="BookingHomeServiceAppointScreen"
          component={BookingHomeServiceAppointScreen}
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="ProductDetailsScreen"
          component={ProductDetailsScreen}
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="ServiceDetailsScreen"
          component={ServiceDetailsScreen}
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="VendorProfileProductDetailsScreen"
          component={VendorProfileProductDetailsScreen}
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="VendorProfileServiceDetailsScreen"
          component={VendorProfileServiceDetailsScreen}
          options={{ drawerItemStyle: { display: "none" } }}
        />
      </Drawer.Navigator>
    </>
  );
}
