import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import MenuOpen from "../../../../assets/icon/vendormenubtn.svg";
import ChatIcon from "../../../../assets/icon/vendorchat.svg";
import { HttpClient } from "../../../../api/HttpClient";
import EmptySVG from "../../../../assets/img/empty.svg";
import { useAuth } from "../../../../context/AuthContext";
import { formatAmount } from "../../../formatAmount";
import { useFocusEffect } from "@react-navigation/native";
import { DateConverter } from "../../../reusuableComponents/DateConverter";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Menu from '../../../../assets/icon/menu.svg'
import Chat from '../../../../assets/icon/chat.svg'
import Bell from '../../../../assets/icon/bell.svg'
import Eye from '../../../../assets/icon/eye.svg'
import Eyesoff from '../../../../assets/icon/eye-off.svg'
import Right from '../../../../assets/icon/right.svg'
import Down from '../../../../assets/icon/arrow-down.svg'
import Up from '../../../../assets/icon/arrow-up.svg'

// Skeleton Loader Component
function SkeletonLoader() {
  const shimmerAnim = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0.3,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnim]);

  const animatedStyle = {
    opacity: shimmerAnim,
    backgroundColor: "#e0e0e0",
  };

  return (
    <View>
      {/* Balance Card Skeleton */}
      <View
        style={{
          marginHorizontal: 16,
          borderRadius: 16,
          padding: 20,
          marginBottom: 24,
          backgroundColor: "#f3f3f3",
        }}
      >
        <Animated.View
          style={[
            { width: 120, height: 16, borderRadius: 8, marginBottom: 12 },
            animatedStyle,
          ]}
        />
        <Animated.View
          style={[
            { width: 100, height: 32, borderRadius: 8, marginBottom: 16 },
            animatedStyle,
          ]}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 8,
          }}
        >
          <Animated.View
            style={[{ width: 80, height: 24, borderRadius: 8 }, animatedStyle]}
          />
          <Animated.View
            style={[{ width: 80, height: 24, borderRadius: 8 }, animatedStyle]}
          />
        </View>
      </View>
      {/* Bookings Skeleton */}
      <View style={{ marginHorizontal: 16, marginBottom: 24 }}>
        {[1, 2, 3].map((_, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Animated.View
              style={[
                { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
                animatedStyle,
              ]}
            />
            <View style={{ flex: 1 }}>
              <Animated.View
                style={[
                  {
                    width: "60%",
                    height: 14,
                    borderRadius: 7,
                    marginBottom: 6,
                  },
                  animatedStyle,
                ]}
              />
              <Animated.View
                style={[
                  { width: "40%", height: 12, borderRadius: 6 },
                  animatedStyle,
                ]}
              />
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Animated.View
                style={[
                  { width: 60, height: 12, borderRadius: 6, marginBottom: 4 },
                  animatedStyle,
                ]}
              />
              <Animated.View
                style={[
                  { width: 40, height: 14, borderRadius: 7 },
                  animatedStyle,
                ]}
              />
            </View>
          </View>
        ))}
      </View>
      {/* Products Skeleton */}
      <View style={{ marginHorizontal: 16, flexDirection: "row" }}>
        {[1, 2].map((_, i) => (
          <View
            key={i}
            style={{
              backgroundColor: "#f3f3f3",
              borderRadius: 4,
              width: 180,
              marginRight: 16,
              padding: 8,
            }}
          >
            <Animated.View
              style={[
                { width: 164, height: 120, borderRadius: 4, marginBottom: 8 },
                animatedStyle,
              ]}
            />
            <Animated.View
              style={[
                { width: "70%", height: 14, borderRadius: 7, marginBottom: 6 },
                animatedStyle,
              ]}
            />
            <Animated.View
              style={[
                { width: "40%", height: 12, borderRadius: 6, marginBottom: 8 },
                animatedStyle,
              ]}
            />
            <Animated.View
              style={[
                { width: "60%", height: 12, borderRadius: 6 },
                animatedStyle,
              ]}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

// Recent Bookings Skeleton Loader
function RecentBookingsSkeletonLoader() {
  const shimmerAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0.3,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnim]);

  const animatedStyle = {
    opacity: shimmerAnim,
    backgroundColor: "#e0e0e0",
  };

  return (
    <View>
      {[1, 2, 3].map((_, i) => (
        <View
          key={i}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          {/* Avatar */}
          <Animated.View
            style={[
              { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
              animatedStyle,
            ]}
          />
          {/* Name and Date/Time */}
          <View style={{ flex: 1 }}>
            <Animated.View
              style={[
                { width: "60%", height: 14, borderRadius: 7, marginBottom: 6 },
                animatedStyle,
              ]}
            />
            <Animated.View
              style={[
                { width: "40%", height: 12, borderRadius: 6 },
                animatedStyle,
              ]}
            />
          </View>
          {/* Service and Price */}
          <View style={{ alignItems: "flex-end" }}>
            <Animated.View
              style={[
                { width: 60, height: 12, borderRadius: 6, marginBottom: 4 },
                animatedStyle,
              ]}
            />
            <Animated.View
              style={[
                { width: 40, height: 14, borderRadius: 7 },
                animatedStyle,
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

export default function DashboardScreen({ navigation }) {
  const [isShowBalance, setIsShowBalance] = useState(false);
  const [products, setProducts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  const { user } = useAuth();

  const toggleShowBalance = () => {
    setIsShowBalance(!isShowBalance);
  };

  // Fetch products, bookings, and wallet balance

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        const token = await AsyncStorage.getItem("token");

        try {
          const [productsRes, bookingsRes, walletRes] = await Promise.all([
            HttpClient.get("/products/getVendorProducts"),
            HttpClient.get("/bookings/getBookings"),
            HttpClient.get("/wallet/walletDetails"),
          ]);

          // Map bookings: ensure each has id, name, date, time, service, price, avatar

          setProducts(productsRes.data.data);
          setBookings(bookingsRes.data.data);
          setWalletBalance(walletRes.data?.wallet?.balance || 0);
        } catch (err) {
          console.error("Error fetching data:", err.response);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [])
  );

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-[40px] pb-4 bg-white">
        <TouchableOpacity onPress={() => navigation.getParent()?.openDrawer()}>
          <Menu stroke='#eb278d'/>
        </TouchableOpacity>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            onPress={() => navigation.navigate("VendorChatListScreen")}
          >
            <Chat stroke='#eb278d' width={40} height={30}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
            <Bell name="notifications-outline" size={22} color="#eb278d" width={40} height={25} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Welcome */}
      <View className="flex-row items-center justify-between px-4 mt-2 mb-4">
        <View>
          <Text
            className="text-[18px] w-[90%]"
            style={{ fontFamily: "latoBold" }}
          >
            Welcome {user?.vendorOnboarding?.businessName}!
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Image
            source={
              user?.avatar
                ? { uri: user.avatar }
                : require("../../../../assets/icon/avatar.png")
            }
            style={{ width: 40, height: 40, resizeMode: "cover" }}
            className="rounded-full mb-2 border border-lightgray"
          />
        </TouchableOpacity>
      </View>

      {/* Balance Card */}
      <View className="bg-primary mx-4 rounded-2xl p-5 mb-6">
        <View className="flex-row justify-between items-center mb-2">
          <View className="flex-row items-center gap-2">
            <Text
              className="text-white text-[14px] opacity-80"
              style={{ fontFamily: "latoBold" }}
            >
              Available Balance
            </Text>
            <TouchableOpacity onPress={toggleShowBalance}>
              
                {isShowBalance ? <Eyesoff stroke='#d4c1ca' width={20} height={15}/> : <Eye stroke='#d4c1ca'  width={20} height={15}/>}
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("VendorTransactionHistory")}
            className="flex-row items-center"
          >
            <Text
              className="text-white text-[12px] opacity-80 mr-1"
              style={{ fontFamily: "latoBold" }}
            >
              Transaction History 
            </Text>
            <Right name="chevron-forward" width={20} height={20} color="#FFFFFF80" />
          </TouchableOpacity>
        </View>
        <View style={{ height: 40, justifyContent: "center" }}>
          {isShowBalance ? (
            <Text
              style={{ fontFamily: "poppinsBold" }}
              className="text-white opacity-80 text-[26px]"
            >
              {formatAmount(walletBalance)}
            </Text>
          ) : (
            <View
              className="flex-row gap-2"
              style={{ justifyContent: "start", alignItems: "center" }}
            >
              {[1, 2, 3, 4].map((i) => (
                <View
                  key={i}
                  className="w-3 h-3 rounded-full bg-white opacity-80"
                />
              ))}
            </View>
          )}
        </View>
        <View className="flex-row justify-between mt-2">
          <TouchableOpacity
            onPress={() => navigation.navigate("FundVendorWallet")}
            className="items-center flex-1"
            style={{ gap: 4 }}
          >
            <Down size={28} color="white" />
            <Text
              style={{ fontFamily: "latoRegular" }}
              className="text-white text-[14px] mt-1"
            >
              Fund wallet
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="items-center flex-1"
            style={{ gap: 4 }}
            onPress={() => navigation.navigate("Withdraw")}
          >
            <Up size={28} color="white" />
            <Text
              style={{ fontFamily: "latoRegular" }}
              className="text-white text-[14px] mt-1"
            >
              Withdraw
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="px-4 mb-6">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-[18px]" style={{ fontFamily: "poppinsMedium" }}>
            Recent Bookings
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Bookings")}>
            <Text
              className="text-primary text-[14px]"
              style={{ fontFamily: "poppinsRegular" }}
            >
              View all
            </Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <RecentBookingsSkeletonLoader />
        ) : bookings.length === 0 ? (
          <View className="items-center justify-center py-8">
            <EmptySVG width={120} height={120} />
            <Text
              className="text-[16px] text-gray-400 mt-2"
              style={{ fontFamily: "poppinsRegular" }}
            >
              No recent bookings
            </Text>
          </View>
        ) : (
          bookings.slice(0, 4).map((b) => (
            <View key={b.id} className="flex-row items-center mb-4">
              <Image
                source={
                  b?.avatar
                    ? { uri: b.avatar }
                    : require("../../../../assets/icon/avatar.png")
                }
                className="w-10 h-10 rounded-full mr-3"
              />
              <View className="flex-1">
                <Text
                  className="text-[14px]"
                  style={{ fontFamily: "poppinsMedium" }}
                >
                  {b?.client?.lastName} {b?.client?.firstName}
                </Text>
                <Text
                  className="text-[12px] text-fadedDark"
                  style={{ fontFamily: "poppinsRegular" }}
                >
                  {DateConverter(b?.date)} {b?.time}
                </Text>
              </View>
              <View className="items-end">
                <Text
                  className="text-[12px] text-fadedDark"
                  style={{ fontFamily: "poppinsRegular" }}
                >
                  {b?.service?.serviceName}
                </Text>
                <Text
                  className="text-[16px] text-primary"
                  style={{ fontFamily: "latoBold" }}
                >
                  {formatAmount(b?.price)}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      <View className="px-4 mb-8">
        <Text
          className="text-[18px] mb-2"
          style={{ fontFamily: "poppinsMedium" }}
        >
          My Products
        </Text>
        {loading ? (
          <SkeletonLoader />
        ) : products.length === 0 ? (
          <View className="items-center justify-center py-8">
            <EmptySVG width={120} height={120} />
            <Text
              className="text-[16px] text-gray-400 mt-2"
              style={{ fontFamily: "poppinsRegular" }}
            >
              No products found
            </Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-3">
              {products
                .filter(
                  (p) =>
                    p.approvalStatus === "APPROVED" ||
                    p.approvalStatus === "PENDING"
                )
                .map((p) => (
                  <View
                    key={p.id}
                    className="bg-gray-100 rounded-[4px] w-[220px] mr-3 relative"
                  >
                    <Image
                      source={{ uri: p.picture }}
                      className="w-[220px] h-[202px] rounded-[4px] mb-2"
                      style={{ resizeMode: "cover" }}
                    />
                    {p.approvalStatus === "PENDING" && (
                      <View className="bg-[#ffffffe8] absolute top-2 right-2 py-[2px] px-3 rounded-[10px] z-10">
                        <Text
                          className="text-[#ff0000] mt-1 text-[10px]"
                          style={{ fontFamily: "poppinsMedium" }}
                        >
                          Not approved yet
                        </Text>
                      </View>
                    )}
                    <View className="flex-row justify-between mb-1">
                      <Text
                        className="text-[16px] w-[70%]"
                        style={{ fontFamily: "poppinsRegular" }}
                      >
                        {p.productName}
                      </Text>
                      {p.price ? (
                        <Text
                          className="text-primary mt-1 text-[14px]"
                          style={{ fontFamily: "poppinsRegular" }}
                        >
                          {formatAmount(p.price)}
                        </Text>
                      ) : null}
                    </View>
                    <View className="flex-row justify-between items-center">
                      <Text
                        className="text-[14px] text-[#00000066]"
                        style={{ fontFamily: "poppinsRegular" }}
                      >
                        {p.qtyAvailable} pieces remaining
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("EditProduct", { product: p })
                        }
                      >
                        <MaterialIcons
                          name="mode-edit"
                          size={24}
                          color="#eb278d"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
            </View>
          </ScrollView>
        )}
      </View>
    </ScrollView>
  );
}
