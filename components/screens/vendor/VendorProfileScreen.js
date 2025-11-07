import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../context/AuthContext";
import { StatusBar } from "expo-status-bar";
import TawkToChat from "../../TawkToChat";

import Map from '../../../assets/icon/map-pin.svg'
import Left from '../../../assets/icon/left.svg'
import Help from '../../../assets/icon/help-circle.svg'
import Settings from '../../../assets/icon/settings.svg'
import Right from '../../../assets/icon/right.svg'
import Medal from '../../../assets/icon/award.svg'
import Out from '../../../assets/icon/log-out.svg'

const VendorProfileScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  const [chatVisible, setChatVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // TODO: Replace with actual vendor info from context or props
  const vendorName = `${user?.vendorOnboarding?.businessName}`;
  const vendorEmail = user?.email;
  const vendorPhone = user?.phone || user?.vendor?.phone || ""; // Add phone from user data
  const vendorAvatar = user?.avatar || ""; // Add avatar from user data
  const vendorRole = "vendor";
  const handleLogout = async () => {
    await logout();
  };

  const handleChatOpen = () => {
    setChatVisible(true);
    setIsLoading(true);
    // Auto hide loader after 10 seconds as fallback
    setTimeout(() => {
      setIsLoading(false);
    }, 10000);
  };

  const handleChatClose = () => {
    setChatVisible(false);
    setIsLoading(true); // Reset loading state for next time
  };

  const handleChatLoad = () => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };
  return (
    <SafeAreaView className="flex-1 bg-secondary">
      {/* Header with logo, name, badge, address */}
      <StatusBar barStyle="light-content" backgroundColor={"#EB278D"} />
      <View className="bg-primary rounded-b-[40px] pt-[40px] pb-8 relative">
        <TouchableOpacity
          className="absolute top-[40px] left-4 z-10 p-2"
          onPress={() => navigation.goBack()}
        >
          <Left name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View className="items-center pt-10">
          <View>
            <Image
              source={
                user?.avatar
                  ? { uri: user.avatar }
                  : require("../../../assets/icon/avatar.png")
              }
              className="w-24 h-24 rounded-full mb-4 bg-white"
            />
          </View>
          <Text
            className="text-white text-[18px] text-center"
            style={{ fontFamily: "poppinsMedium" }}
          >
            {user?.vendorOnboarding?.businessName}
          </Text>
          <View className="flex-row items-center mt-2">
            <View className="bg-white px-3 py-1 rounded-lg flex-row items-center mr-2">
              <View className="w-2 h-2 rounded-full bg-[#ED2584] mr-2" />
              <Text
                className="text-[14px] text-[#ED2584]"
                style={{ fontFamily: "poppinsMedium" }}
              >
                {user?.vendorOnboarding?.serviceType === "IN_SHOP"
                  ? "In-shop"
                  : "Home Service"}
              </Text>
            </View>
          </View>
          <View className="flex-row justify-center w-[70%] mt-2">
            <Map name="location-sharp" width={10} height={20} color="#fff" />
            <Text
              className="text-white text-center text-[14px] ml-1"
              style={{ fontFamily: "poppinsLight" }}
            >
              {user?.vendorOnboarding?.location}
            </Text>
          </View>
        </View>
      </View>
      {/* Options List */}
      <View className="mt-8 px-4 space-y-4">
        {/* Store Setup and Management */}
        <TouchableOpacity
          className="flex-row items-center bg-white mb-1 rounded-xl px-4 py-4 shadow-sm"
          onPress={() => navigation.navigate("StoreManagement")}
        >
          <View className="bg-primary p-2 rounded-full mr-4">
            <Settings name="storefront" size={24} color="#fff" />
          </View>
          <Text
            className="flex-1 text-[16px] text-faintDark"
            style={{ fontFamily: "poppinsRegular" }}
          >
            Store Setup and Management
          </Text>
          <Right name="chevron-forward" size={20} color="#A9A9A9" />
        </TouchableOpacity>
        {/* Settings */}
        {/* <TouchableOpacity
          className="flex-row items-center mb-1 bg-white rounded-xl px-4 py-4 shadow-sm"
          onPress={() => navigation.navigate("VendorSettingsScreen")}
        >
          <View className="bg-primary p-2 rounded-full mr-4">
            <Ionicons name="settings" size={24} color="#fff" />
          </View>
          <Text
            className="flex-1 text-[14px] text-faintDark"
            style={{ fontFamily: "poppinsRegular" }}
          >
            Settings
          </Text>
          <Right name="chevron-forward" size={20} color="#A9A9A9" />
        </TouchableOpacity> */}
        {/* Help and Support */}
        <TouchableOpacity
          onPress={() => navigation.navigate("VendorHelpAndSupportScreen")}
          className="flex-row items-center mb-1 bg-white rounded-xl px-4 py-4 shadow-sm"
        >
          <View className="bg-primary p-2 rounded-full mr-4">
            <Help name="help-circle" size={24} color="#fff" />
          </View>
          <Text
            className="flex-1 text-[16px] text-faintDark"
            style={{ fontFamily: "poppinsRegular" }}
          >
            Help and Support
          </Text>
          <Right name="chevron-forward" size={20} color="#A9A9A9" />
        </TouchableOpacity>
        {/* Legal */}
        <TouchableOpacity
          className="flex-row items-center mb-1 bg-white rounded-xl px-4 py-4 shadow-sm"
          onPress={() => navigation.navigate("VendorLegalScreen")}
        >
          <View className="bg-primary p-2 rounded-full mr-4">
            <Medal name="gavel" size={24} color="#fff" />
          </View>
          <Text
            className="flex-1 text-[16px] text-faintDark"
            style={{ fontFamily: "poppinsRegular" }}
          >
            Legal
          </Text>
          <Right name="chevron-forward" size={20} color="#A9A9A9" />
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity
          className="flex-row items-center mb-1 bg-white rounded-xl px-4 py-4 shadow-sm"
          onPress={handleLogout}
        >
          <View className="bg-[#FF0000] p-2 rounded-full mr-4">
            <Out name="log-out-outline" size={24} color="#fff" />
          </View>
          <Text
            className="flex-1 text-[16px] text-[#FF0000]"
            style={{ fontFamily: "poppinsRegular" }}
          >
            Logout
          </Text>
        </TouchableOpacity>
        {/* Delete Account */}
        {/* <TouchableOpacity className="flex-row items-center bg-white rounded-xl px-4 py-4 shadow-sm">
          <View className="bg-[#FF0000] p-2 rounded-full mr-4">
            <Ionicons name="trash" size={24} color="#fff" />
          </View>
          <Text
            className="flex-1 text-[14px] text-[#FF0000]"
            style={{ fontFamily: "poppinsRegular" }}
          >
            Delete Account
          </Text>
        </TouchableOpacity> */}
        <Modal
          visible={chatVisible}
          animationType="slide"
          onRequestClose={handleChatClose}
        >
          <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
            {/* Loading Overlay */}
            {isLoading && (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "#f5f5f5",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 20,
                }}
              >
                <ActivityIndicator size="large" color="#EB278D" />
                <Text
                  style={{
                    marginTop: 20,
                    fontSize: 16,
                    fontFamily: "poppinsRegular",
                    color: "#666",
                  }}
                >
                  Loading chat...
                </Text>
              </View>
            )}

            {/* WebView */}
            <TawkToChat
              name={vendorName}
              email={vendorEmail}
              phone={vendorPhone}
              avatar={vendorAvatar}
              role={vendorRole}
              onLoadEnd={handleChatLoad}
            />

            {/* Close Button */}
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 40,
                right: 20,
                zIndex: 30,
                backgroundColor: "#fff",
                borderRadius: 20,
                paddingHorizontal: 20,
                paddingVertical: 8,
                elevation: 2,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
              }}
              onPress={handleChatClose}
            >
              <Text
                style={{ fontSize: 16, color: "#EB278D", fontWeight: "bold" }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default VendorProfileScreen;
