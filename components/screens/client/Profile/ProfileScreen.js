import {
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ActivityIndicator,
} from "react-native";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../../context/AuthContext";
import React, { useState } from "react";
import { HttpClient } from "../../../../api/HttpClient";
import { BlurView } from "expo-blur";
import { showToast } from "../../../ToastComponent/Toast";
import User from "../../../../assets/icon/user.svg"
import Help from "../../../../assets/icon/help-circle.svg"
import Award from "../../../../assets/icon/award.svg"
import Logout from "../../../../assets/icon/log-out.svg"
import Trash from "../../../../assets/icon/trash.svg"
import Back from "../../../../assets/icon/back.svg"
import Right from "../../../../assets/icon/right.svg"
// import Right 

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);


  const handleLogout = async () => {
    await logout();
  };

const handleDeleteAccount = async () => {
  console.log("[DeleteAccount] Starting deletion...");
  setIsDeleting(true);

  try {
    console.log("[DeleteAccount] Sending DELETE request to /user/delete");

    const res = await HttpClient.delete("/user/delete");

    console.log("[DeleteAccount] Response received:", res);

    if (res?.data?.success) {
      console.log("[DeleteAccount] Deletion successful, calling logout...");
      showToast.success("Account deleted successfully");
      await logout();
      console.log("[DeleteAccount] Logout completed.");
    } else {
      console.warn("[DeleteAccount] Deletion failed. Response data:", res.data);
      showToast.error("error", res.data?.message || "Failed to delete account");
    }
  } catch (error) {
    console.error("[DeleteAccount] Exception caught:", error);

    if (error.response) {
      console.error("[DeleteAccount] Error response from backend:", error.response.data);
      showToast.error("error", error.response.data?.message || "Server error");
    } else {
      console.error("[DeleteAccount] Network or unknown error:", error.message);
      showToast.error("error", "Network error or server unreachable");
    }
  } finally {
    console.log("[DeleteAccount] Cleaning up... resetting state");
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
    {/* Glass container */}
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
      {/* Add a subtle dark overlay behind content */}
      <View className="absolute inset-0 bg-black  rounded-2xl" />

      {/* Content */}
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
              className="text-black text-sm "
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

      {/* Header with avatar, name, email */}
      <StatusBar backgroundColor="#EB278D" barStyle="light-content" />
      <View className="bg-primary rounded-b-[40px] pt-[30px] pb-8 px-4">
        <TouchableOpacity className="pb-6" onPress={() => navigation.goBack()}>
          <Back name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View className="items-center ">
          <Image
            source={
              user?.avatar
                ? { uri: user.avatar }
                : require("../../../../assets/icon/avatar.png")
            }
            className="w-24 h-24 rounded-full mb-4"
          />
          <Text
            className="text-white text-[18px]"
            style={{ fontFamily: "poppinsMedium" }}
          >
            {`${user?.lastName} ${user?.firstName}`}
          </Text>
          <Text
            className="text-white text-[14px] mt-1"
            style={{ fontFamily: "poppinsLight" }}
          >
            {user?.email}
          </Text>
        </View>
      </View>
      {/* Options List */}
      <View className="mt-8 px-4 space-y-4">
        {/* My Account */}
        <TouchableOpacity
          className="flex-row items-center bg-white mb-1 rounded-xl px-4 py-4 shadow-sm"
          onPress={() => navigation.navigate("UserProfileScreen")}
        >
          <View className="bg-primary p-2 rounded-full mr-4">
            <User name="person" size={24} color="#fff" />
          </View>
          <Text
            className="flex-1 text-[16px] text-faintDark"
            style={{ fontFamily: "poppinsRegular" }}
          >
            My Account
          </Text>
          <Right name="chevron-forward" size={20} color="#A9A9A9" />
        </TouchableOpacity>
        {/* Settings */}
        {/* <TouchableOpacity
          className="flex-row items-center mb-1 bg-white rounded-xl px-4 py-4 shadow-sm"
          onPress={() => navigation.navigate("Settings")}
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
          className="flex-row items-center mb-1 bg-white rounded-xl px-4 py-4 shadow-sm"
          onPress={() => navigation.navigate("HelpSupportScreen")}
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
          onPress={() => navigation.navigate("LegalScreen")}
        >
          <View className="bg-primary p-2 rounded-full mr-4">
            <Award name="gavel" size={24} color="#fff" />
          </View>
          <Text
            className="flex-1 text-[16px] text-faintDark"
            style={{ fontFamily: "poppinsRegular" }}
          >
            Legal
          </Text>
          <Right name="chevron-forward" size={20} color="#A9A9A9" />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center mb-1 bg-white rounded-xl px-4 py-4 shadow-sm"
          onPress={handleLogout}
        >
          <View className="bg-[#FF0000] p-2 rounded-full mr-4">
            <Logout name="log-out-outline" size={24} color="#fff" />
          </View>
          <Text
            className="flex-1 text-[16px] text-[#FF0000]"
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
    <Trash name="trash" size={24} color="#fff" />
  </View>
  <Text
    className="flex-1 text-[16px] text-[#FF0000]"
    style={{ fontFamily: "poppinsRegular" }}
  >
    Delete Account
  </Text>
</TouchableOpacity>


      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
