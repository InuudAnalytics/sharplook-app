import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "./OnboardingScreen";
import VendorBottomNav from "./VendorBottomNav";
import LoginScreen from "../shared/LoginScreen";
import VendorLoginScreen from "./auth/LoginScreen";
import ForgotPasswordScreen from "../shared/ForgotPasswordScreen";
import ResetPasswordScreen from "../shared/ResetPasswordScreen";
import EmailVerificationScreen from "../shared/EmailVerificationScreen";
import SplashScreen from "../shared/SplashScreen";
import VendorRegisterScreen from "./auth/RegisterScreen";
import VendorEmailVerificationScreen from "./auth/EmailVerification";
import VendorBusinessInfoScreen from "./auth/VendorBusinessInfoScreen";
import AddLocationScreen from "./auth/AddLocationScreen";
import PhoneNumberVerificationScreen from "./auth/PhoneNumberVerificationScreen";
import OTPVerificationScreen from "./auth/OTPVerificationScreen";
import VendorBookingDetailScreen from "./VendorBookingDetailScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "./CustomDrawerContent";
import AnalyticsAndInsightScreen from "./AnalyticsAndInsightScreen";
import NotificationList from "./NotificationList";
import NotificationDetailScreen from "./NotificationDetailScreen";
import VendorChatListScreen from "./chatsection/VendorChatList";
import VendorChatDetail from "./chatsection/VendorChatDetails";
import StoreManagementScreen from "./StoreManagementScreen";
import VendorSettingsScreen from "./VendorSettingsScreen";
import VendorHelpSupportScreen from "./VendorHelpSupportScreen";
import VendorLegalScreen from "./VendorLegalScreen";
import VendorPrivacyPolicyScreen from "./VendorPrivacyPolicyScreen";
import VendorTermsOfUseScreen from "./VendorTermsOfUseScreen";

import AddProductScreen from "./ProductAndServices/AddProductScreen";
import AddServicesScreen from "./ProductAndServices/AddServicesScreen";
import EditProductScreen from "./ProductAndServices/EditProduct";
import WithdrawScreen from "./Dashboard/WithdrawScreen";
import EditServicesScreen from "./ProductAndServices/EditService";
import FundVendorWalletScreen from "./Dashboard/FundVendorWallet";
import VendorTransactionHistory from "./Dashboard/VendorTransactionHistory";
import VendorOffersScreen from "./VendorOffersScreen";
import VendorOfferDetailsScreen from "./VendorOfferDetailsScreen";
import SubscriptionScreen from "./SubscriptionScreen";
import VendorReferAndEarnScreen from "./VendorReferAndEarnScreen";
import { Ionicons } from "@expo/vector-icons";
import OrdersStack from "./MyOrder/MyOrderStack";

import ServiceLevelAgreementScreen from "./ServiceLevelAgreement";
import VendorDataProtectionAgreementScreen from "./VendorDataProtectionAgreementScreen";

// import ProtectedRoute from "../../reusuableComponents/ProtectedRoute";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function VendorMainDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Main"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: "#d6c0ad", width: 300 },
        drawerActiveTintColor: "#BF6A37",
        drawerInactiveTintColor: "#3c2a1e",
        drawerLabelStyle: { fontFamily: "poppinsRegular", fontSize: 16 },
        swipeEnabled: false,
        drawerPosition: "left",
      }}
    >
      <Drawer.Screen
        name="Main"
        component={VendorBottomNav}
        options={{ drawerItemStyle: { display: "none" } }}
      />

      <Drawer.Screen
        name="Analytics & Insights"
        component={AnalyticsAndInsightScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="analytics-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Store Management"
        component={StoreManagementScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="storefront-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="OrdersStack"
        component={OrdersStack}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="storefront-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Refer and Earn"
        component={VendorReferAndEarnScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="gift-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Notifications"
        component={NotificationList}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Chat"
        component={VendorChatListScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Settings"
        component={VendorSettingsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Help & Support"
        component={VendorHelpSupportScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="help-circle-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Legal"
        component={VendorLegalScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default function VendorNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ title: "Onboarding", headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={VendorMainDrawer}
        options={{ title: "Home", headerShown: false }}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VendorLogin"
        component={VendorLoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VendorRegister"
        component={VendorRegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VendorEmailVerification"
        component={VendorEmailVerificationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EmailVerification"
        component={EmailVerificationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VendorBusinessInfo"
        component={VendorBusinessInfoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddLocation"
        component={AddLocationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PhoneNumberVerificationScreen"
        component={PhoneNumberVerificationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OTPVerificationScreen"
        component={OTPVerificationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddServices"
        component={AddServicesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditService"
        component={EditServicesScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="VendorBookingDetailScreen"
        component={VendorBookingDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VendorChatListScreen"
        component={VendorChatListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VendorChatDetailScreen"
        component={VendorChatDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notification"
        component={NotificationList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VendorNotificationDetailScreen"
        component={NotificationDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StoreManagement"
        component={StoreManagementScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="VendorSettingsScreen"
        children={(props) => (
          // <ProtectedRoute
          //   {...props}
          //   Component={VendorSettingsScreen}
          //   requiredRole="VENDOR"
          // />
          <VendorSettingsScreen {...props} />
        )}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VendorHelpSupportScreen"
        children={(props) => (
          // <ProtectedRoute
          //   {...props}
          //   Component={VendorHelpSupportScreen}
          //   requiredRole="VENDOR"
          // />
          <VendorHelpSupportScreen {...props} />
        )}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VendorLegalScreen"
        children={(props) => (
          // <ProtectedRoute
          //   {...props}
          //   Component={VendorLegalScreen}
          //   requiredRole="VENDOR"
          // />
          <VendorLegalScreen {...props} />
        )}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VendorPrivacyPolicyScreen"
        children={(props) => (
          // <ProtectedRoute
          //   {...props}
          //   Component={VendorPrivacyPolicyScreen}
          //   requiredRole="VENDOR"
          // />
          <VendorPrivacyPolicyScreen {...props} />
        )}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VendorTermsOfUseScreen"
        children={(props) => (
          // <ProtectedRoute
          //   {...props}
          //   Component={VendorTermsOfUseScreen}
          //   requiredRole="VENDOR"
          // />
          <VendorTermsOfUseScreen {...props} />
        )}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ServiceLevelAgreementScreen"
        children={(props) => (
          // <ProtectedRoute
          //   {...props}
          //   Component={VendorTermsOfUseScreen}
          //   requiredRole="VENDOR"
          // />
          <ServiceLevelAgreementScreen {...props} />
        )}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VendorDataProtectionAgreementScreen"
        children={(props) => (
          // <ProtectedRoute
          //   {...props}
          //   Component={VendorDataProtectionAgreementScreen}
          //   requiredRole="VENDOR"
          // />
          <VendorDataProtectionAgreementScreen {...props} />
        )}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Withdraw"
        component={WithdrawScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FundVendorWallet"
        component={FundVendorWalletScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VendorTransactionHistory"
        component={VendorTransactionHistory}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VendorOffers"
        component={VendorOffersScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="VendorOfferDetails"
        component={VendorOfferDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Subscription"
        component={SubscriptionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VendorReferAndEarn"
        component={VendorReferAndEarnScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="VendorHelpAndSupportScreen"
        children={(props) => <VendorHelpSupportScreen {...props} />}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
