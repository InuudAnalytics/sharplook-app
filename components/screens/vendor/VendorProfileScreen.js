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
import { HttpClient } from "../../../api/HttpClient";
import { BlurView } from "expo-blur";
import { showToast } from "../../ToastComponent/Toast";
const VendorProfileScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  const [chatVisible, setChatVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);


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

const handleDeleteAccount = async () => {
  setIsDeleting(true);
  try {
    const res = await HttpClient.delete("/vendor/deleteMyVendorAcct");

    if (res?.data?.success) {
      showToast.success("Account deleted successfully");
      await logout();
    } else {
      showToast.error("Error", res.data?.message || "Failed to delete account");
    }
  } catch (error) {
    if (error.response) {
      showToast.error("Error", error.response.data?.message || "Server error");
    } else {
      showToast.error("Error", "Network error or server unreachable");
    }
  } finally {
    setIsDeleting(false);
    setShowDeleteModal(false);
  }
};



  return (
    <SafeAreaView className="flex-1 bg-secondary">

      <Modal
  visible={showDeleteModal}
  transparent
  animationType="fade"
  onRequestClose={() => setShowDeleteModal(false)}
>
  <View className="flex-1 justify-center items-center bg-black bg-opacity-60 px-6">
    <BlurView
      intensity={50}
      tint="dark"
      className="rounded-2xl w-full max-w-md p-6 overflow-hidden"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.25)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.3)",
      }}
    >
      <View className="absolute inset-0 bg-black  rounded-2xl" />

      <View className="relative">
        <Text
          className="text-2xl font-semibold text-center mb-4 text-white"
          style={{ fontFamily: "poppinsMedium" }}
        >
          Are you sure you want to delete your account?
        </Text>
        <Text
          className="text-center text-lg mb-6 text-gray-200"
          style={{ fontFamily: "poppinsLight" }}
        >
          This action cannot be undone.
        </Text>

        <View className="flex-row justify-between space-x-3">
          <TouchableOpacity
            onPress={() => setShowDeleteModal(false)}
            className="flex-1 bg-white/70 py-3 rounded-xl items-center mr-4"
          >
            <Text
              className="text-black text-sm"
              style={{ fontFamily: "poppinsRegular" }}
            >
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDeleteAccount}
            className="flex-1 bg-[#FF0000]/90 py-3 rounded-xl items-center"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text
                className="text-white text-sm"
                style={{ fontFamily: "poppinsRegular" }}
              >
                Delete
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </BlurView>
  </View>
</Modal>

      {/* Header with logo, name, badge, address */}
      <StatusBar barStyle="light-content" backgroundColor={"#EB278D"} />
      <View className="bg-primary rounded-b-[40px] pt-[40px] pb-8 relative">
        <TouchableOpacity
          className="absolute top-[40px] left-4 z-10 p-2"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
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
            className="text-white text-[16px] text-center"
            style={{ fontFamily: "poppinsMedium" }}
          >
            {user?.vendorOnboarding?.businessName}
          </Text>
          <View className="flex-row items-center mt-2">
            <View className="bg-white px-3 py-1 rounded-lg flex-row items-center mr-2">
              <View className="w-2 h-2 rounded-full bg-[#ED2584] mr-2" />
              <Text
                className="text-[12px] text-[#ED2584]"
                style={{ fontFamily: "poppinsMedium" }}
              >
                {user?.vendorOnboarding?.serviceType === "IN_SHOP"
                  ? "In-shop"
                  : "Home Service"}
              </Text>
            </View>
          </View>
          <View className="flex-row justify-center w-[70%] mt-2">
            <Ionicons name="location-sharp" size={14} color="#fff" />
            <Text
              className="text-white text-center text-[12px] ml-1"
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
            <Ionicons name="storefront" size={24} color="#fff" />
          </View>
          <Text
            className="flex-1 text-[14px] text-faintDark"
            style={{ fontFamily: "poppinsRegular" }}
          >
            Store Setup and Management
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#A9A9A9" />
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
          <Ionicons name="chevron-forward" size={20} color="#A9A9A9" />
        </TouchableOpacity> */}
        {/* Help and Support */}
        <TouchableOpacity
          onPress={() => navigation.navigate("VendorHelpAndSupportScreen")}
          className="flex-row items-center mb-1 bg-white rounded-xl px-4 py-4 shadow-sm"
        >
          <View className="bg-primary p-2 rounded-full mr-4">
            <Ionicons name="help-circle" size={24} color="#fff" />
          </View>
          <Text
            className="flex-1 text-[14px] text-faintDark"
            style={{ fontFamily: "poppinsRegular" }}
          >
            Help and Support
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#A9A9A9" />
        </TouchableOpacity>
        {/* Legal */}
        <TouchableOpacity
          className="flex-row items-center mb-1 bg-white rounded-xl px-4 py-4 shadow-sm"
          onPress={() => navigation.navigate("VendorLegalScreen")}
        >
          <View className="bg-primary p-2 rounded-full mr-4">
            <MaterialIcons name="gavel" size={24} color="#fff" />
          </View>
          <Text
            className="flex-1 text-[14px] text-faintDark"
            style={{ fontFamily: "poppinsRegular" }}
          >
            Legal
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#A9A9A9" />
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity
          className="flex-row items-center mb-1 bg-white rounded-xl px-4 py-4 shadow-sm"
          onPress={handleLogout}
        >
          <View className="bg-[#FF0000] p-2 rounded-full mr-4">
            <Ionicons name="log-out-outline" size={24} color="#fff" />
          </View>
          <Text
            className="flex-1 text-[14px] text-[#FF0000]"
            style={{ fontFamily: "poppinsRegular" }}
          >
            Logout
          </Text>
        </TouchableOpacity>
                <TouchableOpacity
            className="flex-row items-center bg-white rounded-xl px-4 py-4 shadow-sm"
            onPress={() => setShowDeleteModal(true)}
          >
            <View className="bg-[#FF0000] p-2 rounded-full mr-4">
              <Ionicons name="trash" size={24} color="#fff" />
            </View>
            <Text
              className="flex-1 text-[14px] text-[#FF0000]"
              style={{ fontFamily: "poppinsRegular" }}
            >
              Delete Account
            </Text>
          </TouchableOpacity>

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
