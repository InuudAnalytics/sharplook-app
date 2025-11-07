import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Empty from "../../../../assets/img/empty.svg";
import { HttpClient } from "../../../../api/HttpClient";
import { HexConverter } from "../../../reusuableComponents/HexConverter";
import {
  DateConverter,
  formatDateTime,
} from "../../../reusuableComponents/DateConverter";
import { DayConverter } from "../../../reusuableComponents/DayConverter";
import { formatAmount } from "../../../formatAmount";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import Left from '../../../../assets/icon/left.svg'

export default function MyOrderScreen() {
  const navigation = useNavigation();
  const [tab, setTab] = useState("");
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetchBookings = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await HttpClient.get("/orders/getVendorOrders");
          setOrder(response.data.data || []);
        } catch (err) {
          setError("Failed to load bookings.");
        } finally {
          setLoading(false);
        }
      };
      fetchBookings();
    }, [])
  );

  // Fixed filtering logic - check if ANY item in the array matches the selected status
  const filteredOrders =
    tab === ""
      ? order
      : order.filter((orderItem) => {
          // Check if any item in the items array has the selected status
          return orderItem.status === tab;
        });

  const EmptyState = () => (
    <View className="flex-1 justify-center items-center px-8">
      <Empty width={150} height={150} />
      <Text
        style={{ fontFamily: "poppinsRegular" }}
        className="text-[14px] text-center"
      >
        {tab === "PENDING"
          ? "You have no pending order"
          : tab === "DELIVERED"
            ? "You have no delivered order"
            : "You have no order"}
      </Text>
    </View>
  );

  // Skeleton loader for booking card
  const SkeletonCard = () => (
    <View className="flex-row gap-3 bg-white rounded-[12px] shadow-md mb-5 p-3">
      <View
        className="w-[100px] h-[100px] rounded-[8px] mr-2"
        style={{ backgroundColor: "#e5e7eb" }}
      />
      <View className="flex-1 justify-between">
        <View>
          <View
            className="mb-1"
            style={{
              width: 120,
              height: 16,
              backgroundColor: "#e5e7eb",
              borderRadius: 4,
            }}
          />
          <View
            style={{
              width: 80,
              height: 10,
              backgroundColor: "#e5e7eb",
              borderRadius: 4,
              marginTop: 4,
            }}
          />
          <View
            style={{
              width: 60,
              height: 10,
              backgroundColor: "#e5e7eb",
              borderRadius: 4,
              marginTop: 4,
            }}
          />
          <View
            style={{
              width: 60,
              height: 10,
              backgroundColor: "#e5e7eb",
              borderRadius: 4,
              marginTop: 4,
            }}
          />
          <View
            style={{
              width: 60,
              height: 10,
              backgroundColor: "#e5e7eb",
              borderRadius: 4,
              marginTop: 4,
            }}
          />
        </View>
        <View
          style={{
            width: 50,
            height: 14,
            backgroundColor: "#e5e7eb",
            borderRadius: 4,
            alignSelf: "flex-end",
            marginTop: 8,
          }}
        />
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-secondary">
      <StatusBar backgroundColor="#EB278D" barStyle="light-content" />
      <View
        className="flex-row items-center justify-between px-4 pt-[60px] pb-4 bg-secondary"
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Left name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={{ fontFamily: "poppinsMedium" }} className="text-[18px]">
          Orders
        </Text>
        <View style={{ width: 26 }} />
      </View>

      <View className="flex-row justify-center mt-8 mb-2 gap-3">
        <Pressable
          className={`px-6 py-3 rounded-[8px] ${tab === "" ? "bg-primary" : "bg-white border border-[#A5A5A5]"}`}
          onPress={() => setTab("")}
        >
          <Text
            style={{ fontFamily: "latoBold" }}
            className={`text-[14px] ${tab === "" ? "text-white" : "text-[#A5A5A5]"}`}
          >
            All
          </Text>
        </Pressable>
        <Pressable
          className={`px-6 py-3 rounded-[8px] ${tab === "PENDING" ? "bg-primary" : "bg-white border border-[#A5A5A5]"}`}
          onPress={() => setTab("PENDING")}
        >
          <Text
            style={{ fontFamily: "latoBold" }}
            className={`text-[14px] ${tab === "PENDING" ? "text-white" : "text-[#A5A5A5]"}`}
          >
            Pending
          </Text>
        </Pressable>
        <Pressable
          className={`px-6 py-3 rounded-[8px] ${tab === "DELIVERED" ? "bg-primary" : "bg-white border border-[#A5A5A5]"}`}
          onPress={() => setTab("DELIVERED")}
        >
          <Text
            style={{ fontFamily: "latoBold" }}
            className={`text-[14px] ${tab === "DELIVERED" ? "text-white" : "text-[#A5A5A5]"}`}
          >
            Delivered
          </Text>
        </Pressable>
      </View>

      {loading ? (
        <ScrollView className="px-3 mt-2" showsVerticalScrollIndicator={false}>
          {[...Array(4)].map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </ScrollView>
      ) : filteredOrders.length === 0 ? (
        <EmptyState />
      ) : (
        <ScrollView className="px-3 mt-2" showsVerticalScrollIndicator={false}>
          {filteredOrders.map((order) => {
            // Calculate total price from all items
            const totalPrice =
              order.items?.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              ) || 0;

            // Get the status from the first item (you might want to modify this logic based on your business rules)
            const orderStatus = order.status;

            // Get vendor name from first item (or you could show multiple vendors)
            const clientName = `${order.order?.user?.lastName} ${order?.order?.user?.firstName}`;

            return (
              <Pressable
                key={order.id}
                className="flex-row gap-3 bg-white rounded-[12px] shadow-md mb-5 p-3"
                onPress={() =>
                  navigation.navigate("OrderDetailsScreen", { order })
                }
              >
                <View className="flex-col flex-1">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text
                      className="text-[14px] text-[#0000004D]"
                      style={{ fontFamily: "latoBold" }}
                    >
                      {HexConverter(order?.id)}{" "}
                      {formatDateTime(order?.createdAt)}
                    </Text>
                    <Text
                      className={`text-[14px] ${
                        orderStatus === "PENDING"
                          ? "text-pending"
                          : orderStatus === "DELIVERED"
                            ? "text-success"
                            : "text-[#0D9488]"
                      }`}
                      style={{ fontFamily: "latoBold" }}
                    >
                      {orderStatus}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text
                      className="text-[20px] text-fadedDark"
                      style={{ fontFamily: "latoBold" }}
                    >
                      {formatAmount(totalPrice)}
                    </Text>
                    <Text
                      className="text-[12px] text-gray-500 mb-1"
                      style={{ fontFamily: "latoRegular" }}
                    >
                      {order.items?.length} item
                      {order.items?.length > 1 ? "s" : ""}
                    </Text>
                  </View>

                  <View className="flex-row justify-between items-center mt-2">
                    <Text
                      className="text-[16px]"
                      style={{ fontFamily: "latoRegular" }}
                    >
                      {clientName}
                    </Text>
                    <Text
                      className="text-faintDark text-[14px]"
                      style={{ fontFamily: "latoRegular" }}
                    >
                      View details &gt;
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
