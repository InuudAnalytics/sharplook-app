import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import CloseNavBtn from "../../../assets/icon/opennav.svg";
import { useAuth } from "../../../context/AuthContext";

import Menu from '../../../assets/icon/menu.svg'
import Ques from '../../../assets/icon/help-circle.svg'
import Offer from '../../../assets/icon/clip.svg'
import Active from '../../../assets/icon/activity.svg'
import Order from '../../../assets/icon/package.svg'
import Gift from '../../../assets/icon/gift.svg'
import Card from '../../../assets/icon/credit-card.svg'
import Out from '../../../assets/icon/log-out.svg'
import Bell from '../../../assets/icon/bell.svg'

export default function CustomDrawerContent(props) {
  const { user, logout } = useAuth();
  const handleLogout = async () => {
    await logout();
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, backgroundColor: "#FFFAFD" }}
    >
      <View style={{ marginTop: 30 }}>
        {/* Menu Icon */}
        <View className="justify-start flex-row">
          <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
            <Menu width={30} height={25} stroke='#eb278d'/>
          </TouchableOpacity>
        </View>
        {/* Vendor Info */}
        <View className="flex-row mt-8 gap-3 items-center">
          <Image
            source={
              user?.avatar
                ? { uri: user?.avatar }
                : require("../../../assets/icon/avatar.png")
            }
            style={{
              width: 40,
              height: 40,
              borderRadius: 30,
              marginBottom: 10,
            }}
          />
          <View className="w-[90%]">
            <Text style={{ fontFamily: "poppinsMedium", fontSize: 14 }}>
              {user?.vendorOnboarding?.businessName}
            </Text>
          </View>
        </View>
      </View>
      <View style={{ flex: 1, marginTop: 30, }}>
        {/* Store Setup and Management */}
        <TouchableOpacity
          className="flex-row items-center px-6 py-4"
          onPress={() => props.navigation.navigate("StoreManagement")}
        >
          <Ques name="storefront" height={20} color="#ED2584" />
          <Text
            className="ml-4 text-[16px] text-faintDark"
            style={{ fontFamily: "poppinsRegular" }}
          >
            Store Setup and Management
          </Text>
        </TouchableOpacity>
        {/* Analytics and Insight */}
        <TouchableOpacity
          className="flex-row items-center px-6 py-4"
          onPress={() => props.navigation.navigate("Analytics & Insights")}
        >
          <Active name="analytics-outline" height={20} color="#ED2584" />
          <Text
            className="ml-4 text-[17px] text-faintDark"
            style={{ fontFamily: "poppinsRegular" }}
          >
            Analytics and Insight
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center px-6 py-4"
          onPress={() => props.navigation.navigate("VendorOffers")}
        >
          <Offer name="pricetag-outline" height={20} color="#ED2584" />
          <Text
            className="ml-4 text-[17px] text-faintDark"
            style={{ fontFamily: "poppinsRegular" }}
          >
            Offers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center px-6 py-4"
          onPress={() => props.navigation.navigate("OrdersStack")}
        >
          <Order name="receipt-outline" height={20} color="#ED2584" />
          <Text
            className="ml-4 text-[17px] text-faintDark"
            style={{ fontFamily: "poppinsRegular" }}
          >
            Orders
          </Text>
        </TouchableOpacity>
        {/* Refer and Earn */}
        <TouchableOpacity
          className="flex-row items-center px-6 py-4"
          onPress={() => props.navigation.navigate("Refer and Earn")}
        >
          <Gift name="gift-outline" height={20} color="#ED2584" />
          <Text
            className="ml-4 text-[17px] text-faintDark"
            style={{ fontFamily: "poppinsRegular" }}
          >
            Refer and Earn
          </Text>
        </TouchableOpacity>
        {/* Subscription */}
        <TouchableOpacity
          className="flex-row items-center px-6 py-4"
          onPress={() => props.navigation.navigate("Subscription")}
        >
          <Card name="card-outline" height={20}size={22} color="#ED2584" />
          <Text
            className="ml-4 text-[17px] text-faintDark"
            style={{ fontFamily: "poppinsRegular" }}
          >
            Subscription
          </Text>
        </TouchableOpacity>
        {/* Notification */}
        <TouchableOpacity
          className="flex-row items-center px-6 py-4"
          onPress={() => props.navigation.navigate("Notification")}
        >
          <Bell name="notifications-outline" height={20} color="#ED2584" />
          <Text
            className="ml-4 text-[16px] text-faintDark"
            style={{ fontFamily: "poppinsRegular" }}
          >
            Notification
          </Text>
        </TouchableOpacity>
        {/* Settings */}
        {/* <TouchableOpacity
          className="flex-row items-center px-6 py-4"
          onPress={() => props.navigation.navigate("VendorSettingsScreen")}
        >
          <Ionicons name="settings-outline" size={22} color="#ED2584" />
          <Text
            className="ml-4 text-[16px] text-faintDark"
            style={{ fontFamily: "poppinsRegular" }}
          >
            Settings
          </Text>
        </TouchableOpacity> */}
        {/* Logout */}
        <TouchableOpacity
          className="flex-row items-center px-6 py-4"
          onPress={handleLogout}
        >
          <Out name="logout" height={20} color="#FF0000" />
          <Text
            className="ml-4 text-[14px] text-[#FF0000]"
            style={{ fontFamily: "poppinsRegular" }}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </View>

      {/* Logout Modal */}
    </DrawerContentScrollView>
  );
}
