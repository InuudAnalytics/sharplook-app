import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./components/screens/shared/SplashScreen";
import LoginScreen from "./components/screens/shared/LoginScreen";
import RegisterScreen from "./components/screens/shared/RegisterScreen";
import ClientNavigator from "./components/screens/client/ClientNavigator";
import VendorNavigator from "./components/screens/vendor/VendorNavigator";
import OnboardingScreen from "./components/screens/shared/OnboardingScreen";
import VendorLoginScreen from "./components/screens/vendor/auth/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { useCustomFonts } from "./hooks/useFonts";
import { View, ActivityIndicator } from "react-native";
import ForgotPasswordScreen from "./components/screens/shared/ForgotPasswordScreen";
import EmailVerificationScreen from "./components/screens/shared/EmailVerificationScreen";
import ResetPasswordScreen from "./components/screens/shared/ResetPasswordScreen";
import VendorRegisterScreen from "./components/screens/vendor/auth/RegisterScreen";
import VendorEmailVerificationScreen from "./components/screens/vendor/auth/EmailVerification";
import VendorBusinessInfoScreen from "./components/screens/vendor/auth/VendorBusinessInfoScreen";
import ClientAddLocationScreen from "./components/screens/shared/AddLocationScreen";
import ClientVerifyPhoneNumber from "./components/screens/shared/VerifyPhoneNumber";
import VerifyWithPhoneOTP from "./components/screens/shared/VerifyWithPhoneOTP";
import EmailVerificationForgotPassword from "./components/screens/shared/EmailVerificationForgotPassword";
import EmailVerificationScreenSignup from "./components/screens/shared/EmailVerificationScreenSIgnup";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/reusuableComponents/ProtectedRoute";
import AddLocationScreen from "./components/screens/vendor/auth/AddLocationScreen";
import CallScreen from "./components/screens/client/GlobalScreens/CallScreen";
import InitialSubscriptionScreen from "./components/screens/vendor/auth/InitialSubscriptionScreen";
import PhoneNumberVerificationScreen from "./components/screens/vendor/auth/PhoneNumberVerificationScreen";
import OTPVerificationScreen from "./components/screens/vendor/auth/OTPVerificationScreen";
import AuthPrivacyPolicy from "./components/screens/shared/PrivacyPolicy";
import AuthTermsOfUse from "./components/screens/shared/TermsOfUse";
import notificationService from "./utils/notificationService";

const Stack = createNativeStackNavigator();

export default function AppNavigator({ linking }) {
  const { isAuthenticated, userType, isLoading } = useAuth();
  const fontsLoaded = useCustomFonts();

  // Set up navigation reference for notification service
  const onReady = (navigationRef) => {
    // Always set navigation ref for notification service
    notificationService.setNavigationRef(navigationRef, userType);
  };

  if (!fontsLoaded || isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#EB278D",
        }}
      >
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking} onReady={onReady}>
      <Stack.Navigator
        initialRouteName={
          isAuthenticated
            ? userType === "CLIENT"
              ? "ClientApp"
              : "VendorApp"
            : "Splash"
        }
      >
        {isAuthenticated ? (
          <>
            {userType === "CLIENT" ? (
              <>
                <Stack.Screen name="ClientApp" options={{ headerShown: false }}>
                  {() => (
                    <ProtectedRoute allowedUserTypes={["CLIENT"]}>
                      <ClientNavigator />
                    </ProtectedRoute>
                  )}
                </Stack.Screen>
                <Stack.Screen
                  name="CallScreen"
                  component={CallScreen}
                  options={{ headerShown: false }}
                />
              </>
            ) : (
              <>
                <Stack.Screen name="VendorApp" options={{ headerShown: false }}>
                  {() => (
                    <ProtectedRoute allowedUserTypes={["VENDOR"]}>
                      <VendorNavigator />
                    </ProtectedRoute>
                  )}
                </Stack.Screen>
              </>
            )}
          </>
        ) : (
          <>
            <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Onboarding"
              component={OnboardingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: "Login", headerShown: false }}
            />
            <Stack.Screen
              name="ClientAddLocation"
              component={ClientAddLocationScreen}
              options={{ title: "ClientAddLocation", headerShown: false }}
            />
            <Stack.Screen
              name="ClientVerifyPhoneNumber"
              component={ClientVerifyPhoneNumber}
              options={{ title: "ClientVerifyPhoneNumber", headerShown: false }}
            />
            <Stack.Screen
              name="PhoneNumberVerificationScreen"
              component={PhoneNumberVerificationScreen}
              options={{ title: "ClientVerifyPhoneNumber", headerShown: false }}
            />
            <Stack.Screen
              name="OTPVerification"
              component={OTPVerificationScreen}
              options={{ title: "OTPVerificationScreen", headerShown: false }}
            />
            <Stack.Screen
              name="VerifyWithPhoneOTP"
              component={VerifyWithPhoneOTP}
              options={{ title: "VerifyWithPhoneOTP", headerShown: false }}
            />
            <Stack.Screen
              name="ClientEmailVerificationForgotPassword"
              component={EmailVerificationForgotPassword}
              options={{ title: "VerifyWithPhoneOTP", headerShown: false }}
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
              name="InitialSubscription"
              component={InitialSubscriptionScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EmailVerification"
              component={EmailVerificationScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EmailVerificationSignup"
              component={EmailVerificationScreenSignup}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ResetPassword"
              component={ResetPasswordScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AuthPrivacyPolicy"
              component={AuthPrivacyPolicy}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AuthTermsOfUse"
              component={AuthTermsOfUse}
              options={{ headerShown: false }}
            />
          </>
        )}
        {/* 
        <Stack.Screen
          name="Client"
          component={ClientNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Vendor"
          component={VendorNavigator}
          options={{ headerShown: false }}
        />

        */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
