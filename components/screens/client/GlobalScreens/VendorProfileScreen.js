import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Pressable,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import WhiteChatIcon from "../../../../assets/icon/whitechat.svg";
import BottomModal from "../../../reusuableComponents/BottomModal";
import { useState } from "react";
import OutlineButton from "../../../reusuableComponents/buttons/OutlineButton";
import AuthButton from "../../../reusuableComponents/buttons/AuthButton";
import { formatAmount } from "../../../formatAmount";
import { CTAbtn } from "../../../reusuableComponents/buttons/CTAbtn";

import { useCart } from "../../../../context/CartContext";
import { useAuth } from "../../../../context/AuthContext";
import { HttpClient } from "../../../../api/HttpClient";
import { showToast } from "../../../ToastComponent/Toast";
// import VendorProfileProductDetails from "./VendorProfileProductDetails";
// import VendorProfileServiceDetails from "./VendorProfileServiceDetails";
import { useChatNavigation } from "../../../../hooks/useChatNavigation";
import { ChatConnectionLoader } from "../../../reusuableComponents/ChatConnectionLoader";
import { EmptyData } from "../../../reusuableComponents/EmptyData";
import { checkUserLocationForBooking } from "../../../../utils/locationUtils";

const { width } = Dimensions.get("window");

// Utility function to convert 24-hour time to 12-hour format
const convertTo12HourFormat = (time24) => {
  if (!time24) return "";

  const [hours, minutes] = time24.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

  return `${hour12}:${minutes}${ampm}`;
};

export default function VendorProfileScreen({ navigation, route }) {
  const vendorData = route.params?.vendorData;
  const { user } = useAuth();
  const { cartItems, fetchCart, loading: cartLoading } = useCart();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleProduct, setModalVisibleProduct] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});
  const [bookingLoading, setBookingLoading] = useState({}); // New state for booking loaders
  const { navigateToChat, isConnecting } = useChatNavigation();

  const handleDebitCardPayment = () => {
    setShowPaymentModal(false);
    navigation.navigate("DebitCardScreen");
  };

  const vendorServiceType = vendorData?.vendorOnboarding?.serviceType;
  const cartProductIds = cartItems.map(
    (item) =>
      item.product?.id ||
      item.product?._id ||
      item.productId ||
      item.id ||
      item._id
  );

  const handleServicePress = (service) => {
    navigation.navigate("VendorProfileServiceDetailsScreen", {
      service,
      vendorData,
    });
  };

  const handleProductPress = (product) => {
    navigation.navigate("VendorProfileProductDetailsScreen", {
      product,
      vendorData,
      onAddToCart: handleAddToCartFromModal,
      cartProductIds,
      addingToCart,
    });
  };

  const handleAddToCart = async (product) => {
    const productId = product.id || product._id;
    setAddingToCart((prev) => ({ ...prev, [productId]: true }));

    try {
      const res = await HttpClient.post("/client/addProductTocart", {
        productId: productId,
      });
      showToast.success(res.data.message);
      await fetchCart();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.message ||
        "Failed to add to cart.";
      showToast.error(message);
    } finally {
      setAddingToCart((prev) => {
        const { [productId]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleAddToCartFromModal = async (product, quantity) => {
    for (let i = 0; i < quantity; i++) {
      await handleAddToCart(product);
    }
  };

  // Enhanced booking handler with loading state
const handleBookingNavigation = async (service) => {
  console.log("👉 Starting handleBookingNavigation...");

  const serviceId = service?.id || service?._id;

  setBookingLoading((prev) => ({ ...prev, [serviceId]: true }));

  try {
    // Small delay to ensure data is ready
    await new Promise((resolve) => setTimeout(resolve, 300));

    console.log("📦 Service received:", service);
    console.log("📦 Vendor data:", vendorData);

    // Check if location is required
    if (vendorServiceType === "HOME_SERVICE") {
      console.log("🏠 Vendor service type is HOME_SERVICE. Checking user location...");
      const hasLocation = checkUserLocationForBooking(user, showToast, navigation);
      console.log("📍 Location check result:", hasLocation);

      if (!hasLocation) {
        console.log("❌ Location not set. Cancelling booking navigation.");
        setBookingLoading((prev) => {
          const { [serviceId]: removed, ...rest } = prev;
          return rest;
        });
        return;
      }
    }

    // Validate service and vendor data
    if (!service) throw new Error("❗ Service is missing.");
    if (!vendorData) throw new Error("❗ Vendor data is missing.");
    if (!vendorData.vendorOnboarding) throw new Error("❗ Vendor onboarding data is missing.");

    // Prepare navigation params
    const navigationParams = {
      service: {
        id: service.id || service._id,
        serviceName: service.serviceName,
        servicePrice: service.servicePrice,
        serviceImage: service.serviceImage,
        serviceDuration: service.serviceDuration,
        serviceDescription: service.serviceDescription,
      },
      vendorData: {
        id: vendorData?.id,
        businessName: vendorData?.vendorOnboarding?.businessName,
        serviceType: vendorData?.vendorOnboarding?.serviceType,
        profilePicture: vendorData?.vendorOnboarding?.profilePicture,
        rating: vendorData?.rating,
        phone: vendorData?.phone,
      },
      id: vendorData?.id,
    };

    console.log("✅ Navigation params ready:", navigationParams);

    // Perform navigation
    if (vendorServiceType === "HOME_SERVICE") {
      console.log("🚀 Navigating to BookingHomeServiceAppointScreen...");
      navigation.navigate("BookingHomeServiceAppointScreen", navigationParams);
    } else {
      console.log("🚀 Navigating to BookAppointmentScreen...");
      navigation.navigate("BookAppointmentScreen", navigationParams);
    }

  } catch (error) {
    console.error("❌ Error during navigation:", error);
    showToast.error("Failed to navigate to booking screen");
  } finally {
    // Clear loading state
    setTimeout(() => {
      console.log("✅ Clearing booking loading state for:", serviceId);
      setBookingLoading((prev) => {
        const { [serviceId]: removed, ...rest } = prev;
        return rest;
      });
    }, 500);
  }
};

  const firstServiceId = vendorData?.vendorServices;

  // Complete renderProduct function
  const renderProduct = (item, index) => {
    const productId = item.id || item._id;
    const isInCart = cartProductIds.includes(productId);
    const isAdding = addingToCart[productId];

    return (
      <Pressable
        onPress={() => handleProductPress(item)}
        key={index}
        style={{ width: 160, marginRight: 16 }}
      >
        <View
          style={{
            borderRadius: 4,
            overflow: "hidden",
            backgroundColor: "#fff",
            height: 120,
            width: "100%",
          }}
        >
          <Image
            source={{ uri: item.picture }}
            style={{ width: "100%", height: 120, resizeMode: "cover" }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <Text
            style={{ fontFamily: "poppinsRegular" }}
            className="text-[12px] w-[70%]"
          >
            {item.productName}
          </Text>
          <Text
            style={{ fontFamily: "poppinsRegular" }}
            className="text-[12px] text-primary w-[30%]"
          >
            {formatAmount(item.price)}
          </Text>
        </View>
        <TouchableOpacity
          disabled={isAdding || isInCart}
          className={`py-2 rounded-[8px] mt-3 items-center ${
            isAdding ? "opacity-50" : ""
          } ${isInCart ? "border border-primary bg-white" : "bg-primary"}`}
          onPress={() => handleAddToCart(item)}
        >
          <Text
            style={{
              color: isInCart ? "#EB278D" : "#fff",
              fontFamily: "poppinsRegular",
              fontSize: 12,
            }}
            className="text-center"
          >
            {isAdding
              ? "Adding..."
              : isInCart
                ? "Added to Cart"
                : "Add to Cart"}
          </Text>
        </TouchableOpacity>
      </Pressable>
    );
  };

  // Enhanced CTAbtn component with loading state
  const BookNowButton = ({ service }) => {
    const serviceId = service.id || service._id;
    const isLoading = bookingLoading[serviceId];

    return (
      <CTAbtn
        onPress={() => handleBookingNavigation(service)}
        disabled={isLoading}
        isloading={isLoading}
        title="Book Now"
      />
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }} className="pb-[60px]">
      {/* Chat Connection Loader */}
      <StatusBar backgroundColor="#EB278D" barStyle="light-content" />
      <ChatConnectionLoader visible={isConnecting} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity className="p-2" onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text
          style={{ fontFamily: "poppinsMedium" }}
          className="text-[16px] text-white"
        >
          Vendor's Profile
        </Text> 
        <TouchableOpacity
          onPress={() =>
            navigateToChat(navigation, {
              vendorId: vendorData?.id,
              receiverName: vendorData?.vendorOnboarding?.businessName,
              vendorPhone: vendorData?.phone,
              chat: {
                id: vendorData?.id,
                name: vendorData?.vendorOnboarding?.businessName,
                avatar: vendorData?.vendorOnboarding?.profilePicture,
                vendorId: vendorData?.id,
              },
            })
          }
        >
          <WhiteChatIcon width={30} height={30} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Main Image */}
        <View style={styles.mainImgWrap}>
          <Image
            source={
              vendorData?.avatar
                ? {
                    uri: vendorData?.avatar,
                  }
                : require("../../../../assets/icon/avatar.png")
            }
            style={{ width: "100%", height: 180, resizeMode: "cover" }}
            defaultSource={require("../../../../assets/img/vendorprof.svg")}
          />
        </View>
        {/* Vendor Info */}
        <View style={styles.vendorInfoWrap}>
          <View style={{ flex: 1 }}>
            <Text
              className="text-faintDark text-[18px]"
              style={{ fontFamily: "poppinsMedium" }}
            >
              {vendorData?.vendorOnboarding?.businessName}
            </Text>
            <View className="flex-row justify-between items-center">
              <View style={styles.reviewRow} className="mt-2">
                <Text
                  className="text-[#201E1F] text-[12px]"
                  style={{ fontFamily: "poppinsRegular" }}
                >
                  {vendorData?.rating?.toFixed(1) || "0.0"} Reviews
                </Text>
                <View style={{ flexDirection: "row", marginLeft: 8 }}>
                  {[...Array(5)].map((_, i) => (
                    <Ionicons
                      key={i}
                      name={
                        i < Math.round(vendorData?.rating || 0)
                          ? "star"
                          : "star-outline"
                      }
                      size={20}
                      color="#FFC107"
                    />
                  ))}
                </View>
              </View>
              <View className="p-2 bg-primary mt-1 self-start rounded-[4px]">
                <Text className="text-white text-[12px]">
                  {vendorData?.vendorOnboarding?.serviceType === "HOME_SERVICE"
                    ? "Home Service"
                    : "In-shop"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* See Reviews CTA */}
        <View className="mx-4 mt-3">
          <AuthButton
            title="See Reviews"
            onPress={() => {
              const firstServiceId = vendorData?.id;
              navigation.navigate("ReviewsScreen", {
                vendor: firstServiceId,
              });
            }}
          />
        </View>
        {/* About Us */}
        <View style={styles.sectionWrap}>
          <View className="flex-row items-center justify-between">
            <Text
              style={{ fontFamily: "poppinsMedium" }}
              className="text-[16px]"
            >
              About Us
            </Text>
            <TouchableOpacity
              className="border border-primary rounded-lg py-2 px-4 flex-row items-center"
              onPress={() =>
                navigation.navigate("VendorPortfolioScreen", {
                  portfolio: vendorData?.vendorOnboarding?.portfolioImages,
                  vendorData,
                })
              }
            >
              <Text
                style={{ fontFamily: "poppinsRegular" }}
                className="text-primary text-[12px] mt-1"
              >
                Portfolio
              </Text>
            </TouchableOpacity>
          </View>
          <Text
            style={{ fontFamily: "poppinsRegular" }}
            className="text-[12px] mt-3"
          >
            {vendorData?.vendorOnboarding?.bio}
          </Text>
        </View>
        {/* Availability */}
        <View style={styles.sectionWrap}>
          <Text style={{ fontFamily: "poppinsMedium" }} className="text-[16px]">
            Availability
          </Text>
          {vendorData?.vendorAvailability?.days.length > 0 ? (
            <View className="mt-3">
              {vendorData?.vendorAvailability?.days?.map((item, index) => (
                <View key={index} style={styles.availabilityRow}>
                  <Text
                    style={{ fontFamily: "poppinsRegular" }}
                    className="text-[14px]"
                  >
                    {item}
                  </Text>
                  <Text
                    style={{ fontFamily: "poppinsMedium" }}
                    className="text-[14px] text-primary"
                  >
                    {convertTo12HourFormat(
                      vendorData?.vendorAvailability?.fromTime
                    )}{" "}
                    -{" "}
                    {convertTo12HourFormat(
                      vendorData?.vendorAvailability?.toTime
                    )}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View className="mt-3">
              <Text className="text-[14px] text-primary">
                No availability set
              </Text>
            </View>
          )}
        </View>
        <View className="h-[1px] bg-[#0000001A] mx-4" />

        <View className="h-[1px] bg-[#0000001A] mx-4" />

        <View style={styles.sectionWrap}>
          <Text style={{ fontFamily: "poppinsMedium" }} className="text-[16px]">
            Our Services
          </Text>
          {vendorData?.vendorServices.length > 0 ? (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                marginTop: 16,
              }}
            >
              {vendorData?.vendorServices.map((service, idx) => (
                <Pressable
                  onPress={() => handleServicePress(service)}
                  key={idx}
                  style={{ width: (width - 48) / 2, marginBottom: 20 }}
                >
                  <View
                    style={{
                      borderRadius: 4,
                      overflow: "hidden",
                      backgroundColor: "#fff",
                      height: 120,
                      width: "100%",
                    }}
                  >
                    <Image
                      source={{ uri: service.serviceImage }}
                      style={{
                        width: "100%",
                        height: 120,
                        resizeMode: "cover",
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{ fontFamily: "poppinsRegular" }}
                      className="text-[12px]"
                    >
                      {service.serviceName}
                    </Text>
                    <Text
                      style={{ fontFamily: "poppinsRegular" }}
                      className="text-[12px] text-primary"
                    >
                      {formatAmount(service.servicePrice)}
                    </Text>
                  </View>
                  {/* Replace CTAbtn with BookNowButton */}
                  <BookNowButton service={service} />
                </Pressable>
              ))}
            </View>
          ) : (
            <View className="mt-3">
              <EmptyData msg="No services yet." />
            </View>
          )}
        </View>

        <View style={styles.sectionWrap}>
          <Text style={{ fontFamily: "poppinsMedium" }} className="text-[16px]">
            Our Products
          </Text>
          {vendorData?.products.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: 12 }}
            >
              {vendorData?.products.map((product, idx) =>
                renderProduct(product, idx)
              )}
            </ScrollView>
          ) : (
            <View className="mt-3">
              <EmptyData msg="No products yet." />
            </View>
          )}
        </View>
      </ScrollView>
      {/* Payment Modal */}
      <BottomModal
        isVisible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        showCloseBtn={true}
      >
        <View className="mb-8 mt-2">
          <Text
            className="text-[16px] text-fadedDark"
            style={{ fontFamily: "latoBold" }}
          >
            Payment
          </Text>
        </View>
        <View className="space-y-4 pb-10 mt-2">
          <OutlineButton
            positionLeft
            title="Wallet"
            icon={<Ionicons name="wallet-outline" size={28} color="#EB278D" />}
          />
          <OutlineButton
            positionLeft
            onPress={handleDebitCardPayment}
            title="Debit Card"
            icon={<Ionicons name="card-outline" size={28} color="#EB278D" />}
          />
          <OutlineButton
            positionLeft
            title="USSD"
            icon={<Ionicons name="keypad-outline" size={28} color="#EB278D" />}
          />
        </View>
      </BottomModal>
      {/* <VendorProfileProductDetails
        visible={modalVisibleProduct}
        onClose={() => setModalVisibleProduct(false)}
        product={selectedProduct}
        vendorData={vendorData}
        onAddToCart={handleAddToCartFromModal}
        cartProductIds={cartProductIds}
        addingToCart={addingToCart}
      /> */}
      {/* <VendorProfileServiceDetails
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        service={selectedService}
        vendorData={vendorData}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#EB278D",
    paddingTop: 60,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerTitle: {
    flex: 1,
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  mainImgWrap: {
    width: "100%",
    height: 180,
    backgroundColor: "#eee",
  },
  vendorInfoWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  vendorName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginBottom: 4,
  },
  reviewRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewText: {
    color: "#888",
    fontSize: 14,
  },
  chatBtn: {
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    padding: 8,
    marginLeft: 12,
  },
  sectionWrap: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: "#fff",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
  },
  sectionText: {
    color: "#444",
    fontSize: 14,
    lineHeight: 20,
  },
  availabilityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  availDay: {
    color: "#222",
    fontWeight: "500",
    fontSize: 14,
  },
  availTime: {
    color: "#EB278D",
    fontWeight: "600",
    fontSize: 15,
  },
  specialistWrap: {
    alignItems: "center",
    marginRight: 24,
    width: 80,
  },
  specialistImgWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    overflow: "hidden",
  },
  specialistName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#222",
    textAlign: "center",
  },
  specialistRole: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
  },
});
