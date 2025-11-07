import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../../../context/AuthContext";
import { HttpClient } from "../../../api/HttpClient";
import EmptySVG from "../../../assets/img/empty.svg";
import { formatAmount } from "../../formatAmount";
import { HexConverter } from "../../reusuableComponents/HexConverter";
import { DateConverter } from "../../reusuableComponents/DateConverter";

import Map from '../../../assets/icon/map-pin.svg'

// Skeleton Loader Component
function SkeletonLoader() {
  return (
    <View style={{ paddingHorizontal: 16 }}>
      {[1, 2, 3].map((_, i) => (
        <View
          key={i}
          style={{
            backgroundColor: "#f3f3f3",
            borderRadius: 12,
            marginBottom: 16,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#e0e0e0",
              marginRight: 12,
            }}
          />
          <View style={{ flex: 1 }}>
            <View
              style={{
                width: "60%",
                height: 14,
                borderRadius: 7,
                backgroundColor: "#e0e0e0",
                marginBottom: 6,
              }}
            />
            <View
              style={{
                width: "40%",
                height: 12,
                borderRadius: 6,
                backgroundColor: "#e0e0e0",
              }}
            />
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <View
              style={{
                width: 60,
                height: 12,
                borderRadius: 6,
                backgroundColor: "#e0e0e0",
                marginBottom: 4,
              }}
            />
            <View
              style={{
                width: 40,
                height: 14,
                borderRadius: 7,
                backgroundColor: "#e0e0e0",
              }}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

export default function VendorBookingsScreen() {
  const navigation = useNavigation();
  const [tab, setTab] = useState("ALL");
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  useFocusEffect(
    useCallback(() => {
      const fetchBookings = async () => {
        setLoading(true);
        try {
          const res = await HttpClient.get("/bookings/getBookings");

          setBookings(res.data.data);
        } catch (err) {
          setBookings([]);
        } finally {
          setLoading(false);
        }
      };
      fetchBookings();
    }, [])
  );

  const filteredBookings = bookings.filter((b) => {
    // Exclude REJECTED bookings
    if (b.status === "REJECTED") return false;

    // Filter by tab
    const tabFilter = tab === "ALL" ? true : b.status === tab;

    // Filter by search term (client name)
    const searchFilter =
      search.trim() === "" ||
      (b?.client?.firstName &&
        b.client.firstName.toLowerCase().includes(search.toLowerCase())) ||
      (b?.client?.lastName &&
        b.client.lastName.toLowerCase().includes(search.toLowerCase())) ||
      (b?.client?.firstName &&
        b?.client?.lastName &&
        `${b.client.firstName} ${b.client.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase()));

    return tabFilter && searchFilter;
  });

  const totalBookings = filteredBookings.length;
  const totalAmount = filteredBookings.reduce((sum, b) => sum + b.price, 0);

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-primary pt-[60px] pb-4 px-4">
        <View className="flex-row items-center mb-2">
          <Image
            source={
              user?.avatar
                ? { uri: user.avatar }
                : require("../../../assets/icon/avatar.png")
            }
            style={{ width: 40, height: 40, borderRadius: 25 }}
          />
          <View className="ml-3 flex-1">
            <Text
              style={{ fontFamily: "poppinsMedium" }}
              className="text-white text-[18px]"
            >
              {user?.vendorOnboarding?.businessName}
            </Text>
            <Text
              className="text-white text-[14px] opacity-80"
              style={{ fontFamily: "poppinsRegular" }}
            >
              <Map name="location-sharp" width={10} height={10} color="white" />
              {"  "}
              {user?.vendorOnboarding?.location}
            </Text>
          </View>
        </View>
      </View>
      {/* Summary */}
      <View
        className="bg-white mx-4 rounded-2xl p-5 mt-[-10px] mb-4 flex-row justify-between"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        <View className="flex-1 items-center">
          <Text
            className="text-[14px] text-[#A5A5A5]"
            style={{ fontFamily: "latoRegular" }}
          >
            Total Bookings
          </Text>
          <Text className="text-[20px] mt-1" style={{ fontFamily: "latoBold" }}>
            {totalBookings}
          </Text>
        </View>
        <View className="w-[1px] bg-[#FDE9F4] mx-4" />
        <View className="flex-1 items-center">
          <Text
            className="text-[14px] text-[#A5A5A5]"
            style={{ fontFamily: "latoRegular" }}
          >
            Total Amount
          </Text>
          <Text className="text-[20px] mt-1" style={{ fontFamily: "latoBold" }}>
            {formatAmount(totalAmount)}
          </Text>
        </View>
      </View>
      {/* Tabs */}
      <View className="flex-row mb-2 px-3 gap-2">
        {["ALL", "PENDING", "ACCEPTED", "COMPLETED"].map((t) => (
          <Pressable
            key={t}
            className={`flex-1 px-3 py-[10px] rounded-[8px] ${tab === t ? "bg-primary" : "bg-white border border-[#FCDFEE]"}`}
            onPress={() => setTab(t)}
          >
            <Text
              style={{ fontFamily: "latoBold" }}
              className={`text-[10px] uppercase text-center ${tab === t ? "text-white" : "text-fadedDark"}`}
            >
              {t}
            </Text>
          </Pressable>
        ))}
      </View>
      {/* Search */}
      <View className="mx-4 my-2">
        <TextInput
          className="bg-[#F5F5F5] rounded-[8px] px-4 py-3 text-[16px]"
          placeholder="Search"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      {/* Bookings List */}
      <ScrollView className="px-4" showsVerticalScrollIndicator={false}>
        {loading ? (
          <SkeletonLoader />
        ) : filteredBookings.length === 0 ? (
          <View className="items-center justify-center py-8">
            <EmptySVG width={120} height={120} />
            <Text
              className="text-[16px] text-gray-400 mt-2"
              style={{ fontFamily: "poppinsRegular" }}
            >
              No bookings found
            </Text>
          </View>
        ) : (
          filteredBookings.map((b) => (
            <Pressable
              key={b?.id}
              className="bg-white rounded-[12px] shadow mb-4 p-4"
              onPress={() =>
                navigation.navigate("VendorBookingDetailScreen", { booking: b })
              }
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text
                  className="text-[14px] text-[#0000004D]"
                  style={{ fontFamily: "latoBold" }}
                >
                  {HexConverter(b?.id)} {DateConverter(b.date)} {b.time}
                </Text>
                <Text
                  className={`text-[14px] ${b.dispute !== null ? "text-[#ff0000]" : b.status === "ACCEPTED" ? "text-[#0D9488]" : b.status === "COMPLETED" ? "text-success" : "text-pending"}`}
                  style={{ fontFamily: "latoBold" }}
                >
                  {b?.dispute !== null ? "DISPUTED" : b?.status}
                </Text>
              </View>
              <Text
                className="text-[20px] text-fadedDark"
                style={{ fontFamily: "latoBold" }}
              >
                {formatAmount(b?.price)}
              </Text>
              <View className="flex-row justify-between items-center mt-2">
                <Text
                  className="text-[16px]"
                  style={{ fontFamily: "latoRegular" }}
                >
                  {b?.client?.lastName} {b?.client?.firstName}
                </Text>
                <Text
                  className="text-faintDark text-[14px]"
                  style={{ fontFamily: "latoRegular" }}
                >
                  View details &gt;
                </Text>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}
