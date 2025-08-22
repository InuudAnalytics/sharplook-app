import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserProfileScreen from "./UserProfileScreen";
import EditProfileScreen from "./EditProfileScreen";
import SettingsScreen from "./SettingsScreen";
import HelpSupportScreen from "./HelpSupportScreen";
import LegalScreen from "./LegalScreen";
import TermsOfUseScreen from "./TermsOfUseScreen";
import PrivacyPolicyScreen from "./PrivacyPolicyScreen";

// New Terms of Use Screen Components

import ServiceLevelAgreementScreen from "./ServiceLevelAgreementScreen";
import DataProtectionAgreementScreen from "./DataProtectionAgreementScreen";

import ProfileScreen from "./ProfileScreen";

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator
      initialRouteName="ProfileScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="HelpSupportScreen" component={HelpSupportScreen} />
      <Stack.Screen name="LegalScreen" component={LegalScreen} />
      <Stack.Screen
        name="PrivacyPolicyScreen"
        component={PrivacyPolicyScreen}
      />
      <Stack.Screen name="TermsOfUseScreen" component={TermsOfUseScreen} />

      {/* New Terms of Use Screen Routes */}

      <Stack.Screen
        name="ServiceLevelAgreementScreen"
        component={ServiceLevelAgreementScreen}
      />
      <Stack.Screen
        name="DataProtectionAgreementScreen"
        component={DataProtectionAgreementScreen}
      />

      {/* Add other screens here */}
    </Stack.Navigator>
  );
}
