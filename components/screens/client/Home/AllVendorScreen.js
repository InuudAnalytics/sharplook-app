import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
  StatusBar,
  ActivityIndicator,
  Animated,
  Easing,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
import DefaultAvatar from "../../../../assets/icon/avatar.png";
import { EmptyData } from "../../../reusuableComponents/EmptyData";
import { HttpClient } from "../../../../api/HttpClient";

// Skeleton loader component
function SkeletonBox({ width, height, style }) {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["#ececec", "#f5f5f5"],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: 8,
          backgroundColor,
        },
        style,
      ]}
    />
  );
}

export default function AllVendorsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const title =  "All Vendors";
  const [search, setSearch] = useState("");
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all vendors
  const fetchAllVendors = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await HttpClient.get("/user/vendors"); // Update this endpoint as needed
      setVendors(res.data.data || []);
    } catch (err) {
      console.error("Error fetching vendors:", err);
      setError("Failed to fetch vendors. Please try again.");
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAllVendors();
    }, [])
  );

  // Filter vendors by search
  const filteredVendors = vendors.filter((vendor) => {
    if (!search.trim()) return true;
    const searchLower = search.toLowerCase();
    const vendorNameMatch = vendor?.vendorOnboarding?.businessName
      ?.toLowerCase()
      .includes(searchLower);
    const serviceMatch = vendor?.vendorServices?.some((service) =>
      service?.serviceName?.toLowerCase().includes(searchLower)
    );
    return vendorNameMatch || serviceMatch;
  });

  // Skeleton card component
  const SkeletonCard = () => (
    <View className="w-[47%] mb-4 bg-white rounded-xl shadow-sm border border-[#F6F6F6]">
      <SkeletonBox width="100%" height={120} style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }} />
      <View className="p-3">
        <SkeletonBox width="80%" height={14} style={{ marginBottom: 8 }} />
        <SkeletonBox width="50%" height={20} style={{ marginBottom: 8, borderRadius: 4 }} />
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonBox key={i} width={14} height={14} style={{ marginRight: 2, borderRadius: 3 }} />
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <StatusBar backgroundColor="#EB278D" barStyle="light-content" />
      <View className="bg-primary pt-[60px] pb-4 px-4 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text
          className="text-white text-[16px]"
          style={{ fontFamily: "poppinsMedium" }}
        >
          {title}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Bar */}
      <View className="flex-row items-center px-4 mt-4 mb-2">
        <View className="flex-row items-center flex-1 bg-secondary border border-[#F9BCDC] rounded-xl px-4">
          <MaterialIcons name="search" size={24} color="#8c817a" />
          <TextInput
            className="ml-2 text-sm pb-4 pt-5 placeholder:text-faintDark2 flex-1"
            placeholder="Search Vendor"
            cursorColor="#EB278D"
            value={search}
            onChangeText={setSearch}
            style={{ fontFamily: "poppinsRegular" }}
          />
        </View>
      </View>

      {/* Vendors Count */}
      <View className="px-4 mb-2">
        <Text
          className="text-[14px] text-gray-500"
          style={{ fontFamily: "poppinsRegular" }}
        >
          {loading ? "Loading..." : `${filteredVendors.length} ${filteredVendors.length === 1 ? "Vendor" : "Vendors"} Found`}
        </Text>
      </View>

      {/* Vendors Grid */}
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {loading ? (
          <View className="flex-row flex-wrap justify-between pb-6">
            {[1, 2, 3, 4, 5, 6].map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </View>
        ) : error ? (
          <View className="pb-6 mt-10">
            <EmptyData msg={error} />
            <TouchableOpacity
              onPress={fetchAllVendors}
              className="mt-4 bg-primary py-3 px-6 rounded-lg self-center"
            >
              <Text
                style={{ fontFamily: "poppinsMedium" }}
                className="text-white text-[14px]"
              >
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        ) : filteredVendors.length === 0 ? (
          <View className="pb-6 mt-10">
            <EmptyData msg={search.trim() ? "No vendors found matching your search." : "No vendors available."} />
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between pb-6">
            {filteredVendors.map((vendor) => (
              <Pressable
                onPress={() =>
                  navigation.navigate("VendorProfileScreen", {
                    vendorData: vendor,
                  })
                }
                key={vendor.id}
                className="w-[47%] mb-4 bg-white rounded-xl shadow-sm border border-[#F6F6F6]"
              >
                <Image
                  source={
                    vendor?.avatar ? { uri: vendor?.avatar } : DefaultAvatar
                  }
                  className="w-full h-[120px] rounded-t-lg"
                  resizeMode="cover"
                />
                <View className="p-3">
                  <Text
                    className="text-[14px]"
                    style={{ fontFamily: "poppinsMedium" }}
                    numberOfLines={1}
                  >
                    {vendor?.vendorOnboarding?.businessName}
                  </Text>
                  <View className="bg-primary rounded-[4px] my-1 px-3 self-start">
                    <Text
                      style={{ fontFamily: "poppinsRegular" }}
                      className="text-[8px] mt-1 text-white"
                    >
                      {vendor?.vendorOnboarding?.serviceType === "HOME_SERVICE"
                        ? "Home Service"
                        : "In-shop"}
                    </Text>
                  </View>
                  <View className="flex-row items-center mt-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <MaterialIcons
                        key={i}
                        name="star"
                        size={14}
                        color={
                          i <= Math.round(vendor?.rating || 0)
                            ? "#FFD700"
                            : "#E0E0E0"
                        }
                      />
                    ))}
                    <Text className="ml-1 text-[12px] text-[#444]">
                      {(vendor?.rating || 0).toFixed(1)}
                    </Text>
                  </View>
                  
                  {/* Services Badge */}
                  {vendor?.vendorServices && vendor.vendorServices.length > 0 && (
                    <View className="mt-2 flex-row items-center">
                      <Ionicons name="briefcase-outline" size={12} color="#666" />
                      <Text
                        className="ml-1 text-[10px] text-gray-600"
                        style={{ fontFamily: "poppinsRegular" }}
                      >
                        {vendor.vendorServices.length} {vendor.vendorServices.length === 1 ? "Service" : "Services"}
                      </Text>
                    </View>
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}