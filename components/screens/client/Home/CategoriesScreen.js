import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
  StatusBar,
} from "react-native";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useStatusBar } from "../../../../context/StatusBarContext";
import { EmptyData } from "../../../reusuableComponents/EmptyData";
import { useAuth } from "../../../../context/AuthContext";
import { HttpClient } from "../../../../api/HttpClient";
import {
  getCurrentLocation,
  checkUserLocationForBooking,
} from "../../../../utils/locationUtils";
// import ServiceDetailsModal from "../ServiceDetailsModal";
import DefaultAvatar from "../../../../assets/icon/avatar.png";
import { showToast } from "../../../ToastComponent/Toast";

export default function CategoriesScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { setBarType } = useStatusBar();
  useEffect(() => {
    setBarType("primary");
  }, []);
  const category = route.params?.category || "";
  const nearbyVendors = route.params?.nearbyVendors || [];
  const services = route.params?.services || [];
  const [search, setSearch] = useState("");
  // New state for nearby vendors

  const [loadingNearby, setLoadingNearby] = useState(true);
  const [errorNearby, setErrorNearby] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Handle book now function
  const handleBookNow = (service) => {
    const vendorServiceType =
      service?.vendor?.vendorOnboarding?.serviceType || "IN_SHOP";

    if (vendorServiceType === "HOME_SERVICE") {
      // Check if user has location set for home service booking
      if (!checkUserLocationForBooking(user, showToast)) {
        return;
      }

      navigation.navigate("BookingHomeServiceAppointScreen", {
        service,
        vendorData: service?.vendor,
        id: service?.vendor?.id,
      });
    } else {
      navigation.navigate("BookAppointmentScreen", {
        service,
        vendorData: service?.vendor,
      });
    }
  };

  const filteredServices = services.filter((service) => {
    const searchLower = search.toLowerCase();
    const serviceNameMatch = service.serviceName
      ?.toLowerCase()
      .includes(searchLower);
    const vendorNameMatch = service.vendor?.vendorOnboarding?.businessName
      ?.toLowerCase()
      .includes(searchLower);
    return serviceNameMatch || vendorNameMatch;
  });

  // Filter nearby vendors by search (vendor business name or their services)
  const filteredNearbyVendors = nearbyVendors.filter((vendor) => {
    const searchLower = search.toLowerCase();
    const vendorNameMatch = vendor?.vendorOnboarding?.businessName
      ?.toLowerCase()
      .includes(searchLower);
    const serviceMatch = vendor.vendorServices?.some((service) =>
      service.serviceName?.toLowerCase().includes(searchLower)
    );
    return vendorNameMatch || serviceMatch;
  });

  const handleServicePress = (vendor) => {
    // Transform vendor data to match ServiceDetailsScreen expected structure
    let transformedService = {
      id: vendor.id,
      serviceName: vendor.serviceName,
      servicePrice: vendor.servicePrice,
      serviceImage: vendor.serviceImage || vendor.avatar,
      description:
        vendor.description ||
        `${category} service by ${vendor?.vendorOnboarding?.businessName}`,
      vendor: {
        id: vendor.userId,
        businessName: vendor?.vendor?.vendorOnboarding?.businessName,
        location: vendor?.vendor?.vendorOnboarding?.location,
        latitude: vendor?.vendor?.vendorOnboarding?.latitude,
        longitude: vendor?.vendor?.vendorOnboarding?.longitude,
        vendorOnboarding: vendor?.vendor?.vendorOnboarding,
      },
      rating: vendor.rating || 0,
    };

    navigation.navigate("ServiceDetailsScreen", {
      service: transformedService,
    });
  };

  // Skeleton loader card for vendor
  const SkeletonCard = ({ horizontal }) => (
    <View
      className={
        horizontal
          ? "w-[140px] mr-3 bg-white rounded-xl shadow-sm border border-[#F6F6F6] p-2"
          : "w-[47%] mb-4 bg-white rounded-xl shadow-sm border border-[#F6F6F6]"
      }
      style={{ opacity: 0.7 }}
    >
      <View
        style={{
          width: "100%",
          height: horizontal ? 90 : 100,
          backgroundColor: "#ececec",
          borderRadius: 8,
        }}
      />
      <View
        style={{
          height: 12,
          backgroundColor: "#ececec",
          borderRadius: 4,
          marginTop: 8,
          width: horizontal ? "80%" : "60%",
        }}
      />
      <View
        style={{
          height: 10,
          backgroundColor: "#ececec",
          borderRadius: 4,
          marginTop: 6,
          width: horizontal ? "40%" : "30%",
        }}
      />
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <View
            key={i}
            style={{
              width: 14,
              height: 14,
              backgroundColor: "#ececec",
              borderRadius: 3,
              marginRight: 2,
            }}
          />
        ))}
        <View
          style={{
            width: 24,
            height: 10,
            backgroundColor: "#ececec",
            borderRadius: 4,
            marginLeft: 4,
          }}
        />
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
          Categories ({category})
        </Text>
        <View style={{ width: 22 }} />
      </View>
      {/* Search Bar */}
      <View className="flex-row items-center px-4 mt-4 mb-2">
        <View className="flex-row items-center flex-1 bg-secondary border border-[#F9BCDC] rounded-xl px-4 mr-3">
          <View>
            <MaterialIcons name="search" size={24} color="#8c817a" />
          </View>
          <TextInput
            className="ml-2 text-sm pb-4 pt-5 placeholder:text-faintDark2"
            placeholder="Search Vendor"
            cursorColor="#EB278D"
            value={search}
            onChangeText={setSearch}
            style={{ fontFamily: "poppinsRegular" }}
          />
        </View>

        {/* <TouchableOpacity className="ml-3 bg-primary p-2 rounded-lg">
          <Feather name="sliders" size={18} color="#fff" />
        </TouchableOpacity> */}
      </View>
      {/* Vendors Near You */}
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <Text
          className="text-[16px] mt-2 mb-2"
          style={{ fontFamily: "poppinsMedium" }}
        >
          {category} Vendors near you
        </Text>
        {filteredNearbyVendors.length === 0 ? (
          <View className="pb-6">
            <EmptyData msg={`No ${category} vendors available.`} />
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
          >
            {filteredNearbyVendors.map((vendor) => (
               <Pressable
    onPress={() => {
      console.log("Vendor Data:", vendor);  // <-- Log vendorData here
      navigation.navigate("VendorProfileScreen", {
        vendorData: vendor,
      });
    }}
    key={vendor.id}
    className="w-[140px] mr-3 bg-white rounded-xl shadow-sm border border-[#F6F6F6]"
  >
                <Image
                  source={
                    vendor?.avatar ? { uri: vendor?.avatar } : DefaultAvatar
                  }
                  className="w-full h-[90px] rounded-t-lg"
                  resizeMode="cover"
                />
                <View className="p-3">
                  <Text
                    className="mt-2 text-[14px]"
                    style={{ fontFamily: "poppinsRegular" }}
                    numberOfLines={1}
                  >
                    {vendor?.vendorOnboarding?.businessName}
                  </Text>
                  <View className="bg-primary rounded-[4px] my-1 px-3 self-start">
                    <Text
                      style={{ fontFamily: "poppinsRegular" }}
                      className="text-[10px] mt-1 text-white"
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
                          i <= Math.round(vendor.rating || 0)
                            ? "#FFD700"
                            : "#E0E0E0"
                        }
                      />
                    ))}
                    <Text className="ml-1 text-[14px] text-[#444]">
                      {(vendor.rating || 0).toFixed(1)}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        )}
        {/* Vendors on Sharplook */}
        <Text
          className="text-[16px] mt-2 mb-2"
          style={{ fontFamily: "poppinsMedium" }}
        >
          {category} Vendors on Sharplook
        </Text>
        <View className="flex-row flex-wrap justify-between">
          {filteredServices.length === 0 ? (
            <View style={{ width: "100%", alignItems: "center" }}>
              <View className="w-[60%]">
                <EmptyData msg="No vendors on Sharplook for this category." />
              </View>
            </View>
          ) : (
            filteredServices.map((service) => (
              <Pressable
                onPress={() => handleServicePress(service)}
                key={service.id}
                className="w-[47%] mb-4 bg-white rounded-xl shadow-sm border border-[#F6F6F6]"
              >
                <Image
                  source={{ uri: service.serviceImage }}
                  className="w-full h-[100px] rounded-t-lg"
                  resizeMode="cover"
                />
                <View className="px-3 pb-3">
                  <Text
                    className="mt-2 text-[14px]"
                    style={{ fontFamily: "poppinsRegular" }}
                    numberOfLines={1}
                  >
                    {service.serviceName}
                  </Text>
                <View className="bg-primary rounded-[4px] my-1 px-3 self-start">
  <Text
    style={{ fontFamily: "poppinsRegular" }}
    className="text-[8px] mt-1 text-white"
  >
    {service?.vendor?.vendorOnboarding?.serviceType === "HOME_SERVICE"
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
                          i <= Math.round(service.averageRating || 0)
                            ? "#FFD700"
                            : "#E0E0E0"
                        }
                      />
                    ))}
                    <Text className="ml-1 text-[14px] text-[#444]">
                      {(service.averageRating || 0).toFixed(1)}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))
          )}
        </View>
        {/* <TouchableOpacity className="items-center mt-2 mb-8">
          <Text
            className="text-[13px] text-primary"
            style={{ fontFamily: "poppinsRegular" }}
          >
            Load More
          </Text>
        </TouchableOpacity> */}
      </ScrollView>
      {/* <ServiceDetailsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        service={selectedService}
        onBookNow={handleBookNow}
      /> */}
    </View>
  );
}
