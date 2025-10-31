import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Pressable,
  Animated,
  Easing,
  StatusBar,
} from "react-native";
import {
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import FilterBtn from "../../../../assets/icon/filter.svg";
import EmptySVG from "../../../../assets/img/empty.svg";
import MakeupPromo from "../../../../assets/img/makeuppromo.png";
import Refer from "../../../../assets/img/refer.png";
import Feather from "@expo/vector-icons/Feather";
import { useCart } from "../../../../context/CartContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Menu from "../../../../assets/icon/homemenubtn.svg";
import ProductOne from "../../../../assets/img/product1.jpg";
import ProductTwo from "../../../../assets/img/product2.jpg";
import ProductThree from "../../../../assets/img/product3.jpg";
import ProductFour from "../../../../assets/img/product4.jpg";
import ProductFive from "../../../../assets/img/product5.jpg";
import ProductSix from "../../../../assets/img/product6.jpg";
import { useAuth } from "../../../../context/AuthContext";
import { HttpClient } from "../../../../api/HttpClient";
import DefaultAvatar from "../../../../assets/icon/avatar.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useChatNavigation } from "../../../../hooks/useChatNavigation";
import { useCategories } from "../../../../hooks/useCategories";
import { useFilter } from "../../../../context/FilterContext";
import { getCurrentLocation } from "../../../../utils/locationUtils";

const recommendedProducts = [
  { image: ProductOne },
  { image: ProductTwo },
  { image: ProductThree },
  { image: ProductFour },
  { image: ProductFive },
  { image: ProductSix },
];

// SkeletonBox component for loading placeholders
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
          marginRight: 12,
        },
        style,
      ]}
    />
  );
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const [isSearchBarActive, setIsSearchBarActive] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [topVendors, setTopVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(true);
  const [allServices, setAllServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingNearby, setLoadingNearby] = useState(true);
  const [nearbyVendors, setNearbyVendors] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // ⭐ New state for unread message count
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingUnread, setLoadingUnread] = useState(true);
  
  const searchInputRef = React.useRef(null);
  const { navigateToChatList } = useChatNavigation();
  const { categories, loading: categoriesLoading } = useCategories();
  const { filterVendors, filters } = useFilter();
  const { cartItems, fetchCart, loading: cartLoading } = useCart();
  const [addingToCart, setAddingToCart] = useState({});
  
  const toggleSearchBar = () => {
    setIsSearchBarActive(!isSearchBarActive);
    setSearchInput("");
    setFilteredVendors([]);
  };
  
  const user = useAuth();

  // ⭐ Function to fetch unread message count
  const fetchUnreadCount = async () => {
    try {
      setLoadingUnread(true);
      const response = await HttpClient.get("/messages/unread/count");
      
      if (response.data.success) {
        // ⭐ Fixed: response.data.data is the count directly, not an object
        setUnreadCount(response.data.data || 0);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
      setUnreadCount(0);
    } finally {
      setLoadingUnread(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCart();
      fetchUnreadCount(); // ⭐ Fetch unread count when screen focuses
      
      const fetchRecommendedProducts = async () => {
        setLoadingProducts(true);
        try {
          const res = await HttpClient.get(
            "/user/products/top-selling?limit=5"
          );
          setRecommendedProducts(res.data.data);
        } catch (error) {
        } finally {
          setLoadingProducts(false);
        }
      };
      
      const fetchTopVendors = async () => {
        setLoadingVendors(true);
        try {
          const res = await HttpClient.get("/user/topVendors");
          setTopVendors(res.data.data);
        } catch (error) {
        } finally {
          setLoadingVendors(false);
        }
      };
      
      const fetchAllServices = async () => {
        setLoadingServices(true);
        try {
          const res = await HttpClient.get("/client/services");
          setAllServices(res.data.data);
        } catch (error) {
        } finally {
          setLoadingServices(false);
        }
      };
      
      const fetchNearbyVendors = async () => {
        setLoadingNearby(true);
        try {
          let location;
          try {
            location = await getCurrentLocation();
          } catch (locationError) {
            console.error("Location error:", locationError);
            setNearbyVendors([]);
            setLoadingNearby(false);
            return;
          }

          const latitude = location.latitude;
          const longitude = location.longitude;

          const res = await HttpClient.get(
            `/user/nearby-vendors?latitude=${latitude}&longitude=${longitude}`
          );

          setNearbyVendors(res.data?.data || []);
        } catch (err) {
          console.error("Error fetching services:", err);
          setNearbyVendors([]);
        } finally {
          setLoadingNearby(false);
        }
      };
      
      fetchRecommendedProducts();
      fetchTopVendors();
      fetchAllServices();
      fetchNearbyVendors();
    }, [fetchCart])
  );

  useEffect(() => {
    if (searchInput.trim() === "") {
      setFilteredVendors([]);
    } else {
      const vendorsWithBusinessName = topVendors.filter((vendor) =>
        vendor?.vendorOnboarding?.businessName?.trim()
      );

      const filtered = vendorsWithBusinessName.filter((vendor) => {
        const name = vendor?.vendorOnboarding?.businessName || "";
        return name.toLowerCase().includes(searchInput.toLowerCase());
      });
      setFilteredVendors(filtered);
    }
  }, [searchInput, topVendors]);

  const currentUser = user.user;
  
  const handleProductPress = (product) => {
    navigation.navigate("ProductDetailsScreen", {
      product,
      onAddToCart: handleAddToCartFromModal,
      cartProductIds,
      addingToCart,
    });
  };
  
  const cartProductIds = cartItems.map(
    (item) =>
      item.product?.id ||
      item.product?._id ||
      item.productId ||
      item.id ||
      item._id
  );
  
  const handleAddToCart = async (product) => {
    const productId = product.id || product._id;

    setAddingToCart((prev) => ({ ...prev, [productId]: true }));
    try {
      const res = await HttpClient.post("/client/addProductTocart", {
        productId: productId,
      });
      await fetchCart();
      showToast.success(res.data.message);
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
  
  return (
    <View className="flex-1 bg-secondary" style={{ position: "relative" }}>
      <StatusBar backgroundColor="#EB278D" barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} style={{ zIndex: 20 }}>
        {/* Header */}
        <View className="px-5 pt-[40px] items-center justify-between flex-row">
          <View>
            <Text
              style={{ fontFamily: "poppinsSemiBold" }}
              className="text-[18px]"
            >
              Hello {currentUser.firstName}
            </Text>
            <Text
              style={{ fontFamily: "poppinsRegular" }}
              className="text-[14px]"
            >
              Welcome to Sharplook
            </Text>
          </View>
          <View className="items-center flex-row gap-[12px]">
            {/* ⭐ Chat icon with unread count badge - WhatsApp style */}
            <TouchableOpacity
              className="relative"
              onPress={() => {
                navigateToChatList(navigation);
                // Reset unread count when navigating to chat
                setUnreadCount(0);
              }}
            >
              <Entypo name="chat" size={24} color="#EB278f" />
              {unreadCount > 0 && (
                <View 
                  className="absolute -top-2 -right-2 min-w-[20px] h-5 rounded-full bg-red-600 items-center justify-center px-1.5"
                  style={{
                    shadowColor: "#cd1717ff",
                    shadowOffset: { width: 1, height: 1 },
                    shadowOpacity: 0.5,
                    shadowRadius: 1.8,
                    elevation: 3,
                  }}
                >
                  <Text 
                    className="text-[20px] text-white font-bold"
                    style={{ fontFamily: "poppinsSemiBold" }}
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              className="relative"
              onPress={() => navigation.navigate("CartScreen")}
            >
              <Feather name="shopping-cart" size={24} color="#EB278D" />
              {cartItems.length > 0 && (
                <View className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary items-center justify-center">
                  <Text className="text-[10px] text-white font-medium">
                    {cartItems.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Menu width={30} height={30} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center px-4 mt-6">
          <View className="flex-row items-center flex-1 bg-secondary border border-[#F9BCDC] rounded-xl px-4 mr-3">
            <Pressable onPress={() => toggleSearchBar()}>
              {isSearchBarActive ? (
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color="#8c817a"
                />
              ) : (
                <MaterialIcons name="search" size={24} color="#8c817a" />
              )}
            </Pressable>
            <TextInput
              ref={searchInputRef}
              className="ml-2 text-sm pb-4 pt-5 placeholder:text-faintDark2"
              placeholder="Search Shop or Vendor"
              cursorColor="#EB278D"
              style={{ fontFamily: "poppinsRegular" }}
              onFocus={() => setIsSearchBarActive(true)}
              value={searchInput}
              onChangeText={setSearchInput}
            />
          </View>

          <TouchableOpacity onPress={() => navigation.navigate("Filter")}>
            <View className="relative">
              <FilterBtn width={35} height={35} color="#fff" />
              {(filters.rating || filters.serviceType) && (
                <View className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500" />
              )}
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Filter Summary */}
        {(filters.rating || filters.serviceType) && (
          <View className="px-4 mt-2">
            <View className="bg-[#FCE4F0] rounded-lg p-3">
              <Text
                style={{ fontFamily: "poppinsMedium" }}
                className="text-[14px] text-primary mb-1"
              >
                Active Filters:
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {filters.rating && (
                  <View className="bg-primary rounded-full px-3 py-1">
                    <Text
                      style={{ fontFamily: "poppinsRegular" }}
                      className="text-[12px] text-white"
                    >
                      {filters.rating}+ Stars
                    </Text>
                  </View>
                )}
                {filters.serviceType && (
                  <View className="bg-primary rounded-full px-3 py-1">
                    <Text
                      style={{ fontFamily: "poppinsRegular" }}
                      className="text-[12px] text-white"
                    >
                      {filters.serviceType === "HOME_SERVICE"
                        ? "Home Service"
                        : "In-shop"}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}
        
        {/* Categories or Search Results */}
        {isSearchBarActive ? (
          <ScrollView className="mt-8 px-4 space-y-4" style={{ zIndex: 20 }}>
            {searchInput.trim() === "" ? null : filteredVendors.length === 0 ? (
              <View className="items-center justify-center py-8">
                <EmptySVG width={120} height={120} />
                <Text
                  className="text-[16px] text-gray-400 mt-2"
                  style={{ fontFamily: "poppinsRegular" }}
                >
                  No vendors found
                </Text>
              </View>
            ) : (
              filteredVendors.map((vendor, idx) => (
                <Pressable
                  key={vendor.id || idx}
                  onPress={() => {
                    navigation.navigate("VendorProfileScreen", {
                      vendorData: vendor,
                    });
                    setIsSearchBarActive(false);
                    setSearchInput("");
                    setFilteredVendors([]);
                    if (searchInputRef.current) {
                      searchInputRef.current.blur();
                    }
                  }}
                  className="bg-[#FCDFEE] mb-6 rounded-2xl overflow-hidden shadow-md"
                  style={{ elevation: 2 }}
                >
                  <View style={{ height: 150, width: "100%" }}>
                    <Image
                      source={
                        vendor.avatar ? { uri: vendor.avatar } : DefaultAvatar
                      }
                      style={{ width: "100%", height: 150 }}
                      resizeMode="cover"
                    />
                  </View>
                  <View className="p-4">
                    <Text
                      className="text-lg font-medium text-faintDark"
                      style={{ fontFamily: "poppinsRegular" }}
                    >
                      {vendor?.vendorOnboarding?.businessName}
                    </Text>
                    <View className="bg-primary rounded-[4px] my-1 px-3 self-start">
                      <Text
                        style={{ fontFamily: "poppinsRegular" }}
                        className="text-[10px] mt-1 text-white"
                      >
                        {vendor?.vendorOnboarding?.serviceType ===
                        "HOME_SERVICE"
                          ? "Home Service"
                          : "In-shop"}
                      </Text>
                    </View>
                    <View className="flex-row items-center mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Ionicons
                          key={i}
                          name={
                            i < Math.round(vendor.rating)
                              ? "star"
                              : "star-outline"
                          }
                          size={16}
                          color="#FFC107"
                        />
                      ))}
                      <Text
                        style={{ fontFamily: "poppinsRegular" }}
                        className="text-[12px] text-fadedDark mt-1 ml-1"
                      >
                        {vendor.rating?.toFixed(1)}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))
            )}
          </ScrollView>
        ) : (
          <View className="pb-10">
            <View className="flex-row justify-between mt-6 px-2">
              {categoriesLoading
                ? Array.from({ length: 5 }).map((_, idx) => (
                    <View key={idx} className="items-center flex-1">
                      <View className="rounded-full h-[54px] w-[54px] items-center justify-center mb-1 border border-lightgray" />
                      <View className="w-8 h-2 bg-gray-200 rounded mt-1" />
                    </View>
                  ))
                : (() => {
                    const firstFourCategories = categories.slice(0, 4);

                    return [
                      ...firstFourCategories.map((cat, idx) => (
                        <TouchableOpacity
                          key={cat.id}
                          className="items-center flex-1"
                          onPress={() => {
                            const filteredServices = allServices.filter(
                              (service) => service.serviceName === cat.name
                            );

                            const filteredNearby = nearbyVendors.filter(
                              (vendor) =>
                                vendor.vendorServices?.some(
                                  (service) => service.serviceName === cat.name
                                )
                            );

                            navigation.navigate("Categories", {
                              category: cat.name,
                              services: filteredServices,
                              nearbyVendors: filteredNearby,
                            });
                          }}
                        >
                          <View className="rounded-full h-[54px] w-[54px] items-center justify-center mb-1 border border-primary">
                            <Ionicons
                              name="sparkles"
                              size={24}
                              color="#EB278D"
                            />
                          </View>
                          <Text
                            style={{ fontFamily: "latoRegular" }}
                            className="text-[12px] text-faintDark text-center mt-0.5"
                          >
                            {cat.name}
                          </Text>
                        </TouchableOpacity>
                      )),
                      <TouchableOpacity
                        key="others"
                        className="items-center flex-1"
                        onPress={() => {
                          navigation.navigate("OtherScreen", {
                            allServices: allServices,
                          });
                        }}
                      >
                        <View className="rounded-full h-[54px] w-[54px] items-center justify-center mb-1 border border-primary">
                          <Ionicons
                            name="ellipsis-horizontal"
                            size={24}
                            color="#EB278D"
                          />
                        </View>
                        <Text
                          style={{ fontFamily: "latoRegular" }}
                          className="text-[12px] text-faintDark text-center mt-0.5"
                        >
                          View All
                        </Text>
                      </TouchableOpacity>,
                    ];
                  })()}
            </View>
            
            {/* Top Vendors */}
            <View className="flex-row items-center justify-between mt-8 mb-4 px-5">
              <Text
                style={{ fontFamily: "poppinsMedium" }}
                className="text-[16px] text-fadedDark"
              >
                Top Vendors
              </Text>
              <TouchableOpacity 
                onPress={() => {
                  navigation.navigate("AllVendorsScreen", {
                    title: "All Vendors"
                  });
                }}
              >
                <Text
                  style={{ fontFamily: "poppinsMedium" }}
                  className="text-[14px] text-primary"
                >
                  View All Vendors
                </Text>
              </TouchableOpacity>
            </View>
            
            {loadingVendors ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ paddingLeft: 20 }}
              >
                {[1, 2, 3].map((_, idx) => (
                  <SkeletonBox key={idx} width={125} height={160} />
                ))}
              </ScrollView>
            ) : (
              (() => {
                const vendorsWithBusinessName = topVendors.filter((vendor) =>
                  vendor?.vendorOnboarding?.businessName?.trim()
                );
                const filteredVendors = filterVendors(vendorsWithBusinessName);

                if (filteredVendors.length === 0) {
                  return (
                    <View className="items-center justify-center py-8">
                      <EmptySVG width={120} height={120} />
                      <Text
                        className="text-[14px] text-gray-400 mt-2"
                        style={{ fontFamily: "poppinsRegular" }}
                      >
                        {filters.rating || filters.serviceType
                          ? "No vendors match your filters"
                          : "No Top Vendors"}
                      </Text>
                    </View>
                  );
                }

                return (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ paddingLeft: 20 }}
                  >
                    {filteredVendors.map((vendor, idx) => (
                      <Pressable
                        onPress={() =>
                          navigation.navigate("VendorProfileScreen", {
                            vendorData: vendor,
                          })
                        }
                        key={vendor.id || idx}
                        className="w-[125px] bg-white rounded-2xl mr-3 py-4 shadow-sm overflow-hidden"
                      >
                        <Image
                          source={
                            vendor.avatar
                              ? { uri: vendor.avatar }
                              : DefaultAvatar
                          }
                          style={{
                            width: "100%",
                            height: 100,
                            marginBottom: 8,
                            marginTop: -16,
                          }}
                          resizeMode="cover"
                        />
                        <View className="px-[10px]">
                          <Text
                            style={{ fontFamily: "poppinsRegular" }}
                            className="text-[12px] text-fadedDark mt-0.5"
                          >
                            {vendor?.vendorOnboarding?.businessName}
                          </Text>
                          <View className="bg-primary rounded-[4px] my-1 px-3 self-start">
                            <Text
                              style={{ fontFamily: "poppinsRegular" }}
                              className="text-[8px] mt-1 text-white"
                            >
                              {vendor?.vendorOnboarding?.serviceType ===
                              "HOME_SERVICE"
                                ? "Home Service"
                                : "In-shop"}
                            </Text>
                          </View>
                          <View className="flex-row items-center mt-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Ionicons
                                key={i}
                                name={
                                  i < Math.round(vendor?.rating)
                                    ? "star"
                                    : "star-outline"
                                }
                                size={16}
                                color="#FFC107"
                              />
                            ))}
                            <Text
                              style={{ fontFamily: "poppinsRegular" }}
                              className="text-[12px] text-fadedDark mt-1 ml-1"
                            >
                              {vendor?.rating?.toFixed(1)}
                            </Text>
                          </View>
                        </View>
                      </Pressable>
                    ))}
                  </ScrollView>
                );
              })()
            )}

            {/* Recommended Products */}
            <View className="flex-row items-center justify-between mt-8 px-5">
              <Text
                style={{ fontFamily: "poppinsMedium" }}
                className="text-[16px] text-fadedDark"
              >
                Recommended Products
              </Text>
            </View>
            {loadingProducts ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ paddingLeft: 20 }}
              >
                {[1, 2, 3].map((_, idx) => (
                  <SkeletonBox key={idx} width={220} height={202} />
                ))}
              </ScrollView>
            ) : recommendedProducts.length === 0 ? (
              <View className="items-center justify-center py-8">
                <EmptySVG width={120} height={120} />
                <Text
                  className="text-[14px] text-gray-400 mt-2"
                  style={{ fontFamily: "poppinsRegular" }}
                >
                  No recommended products
                </Text>
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ paddingLeft: 20 }}
                className="flex-row px-5 mt-4"
              >
                {recommendedProducts.map((prod, idx) => (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => handleProductPress(prod)}
                    key={prod.id || idx}
                    className="rounded-[4px] mr-4 items-center justify-center w-[220px] h-[202px] overflow-hidden shadow-sm"
                  >
                    <Image
                      source={{ uri: prod.picture }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        )}
      </ScrollView>
      
      {/* Overlay to close search bar */}
      {isSearchBarActive && (
        <Pressable
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 5,
          }}
          onPress={() => {
            setIsSearchBarActive(false);
            setSearchInput("");
            setFilteredVendors([]);
            if (searchInputRef.current) {
              searchInputRef.current.blur();
            }
          }}
        />
      )}
    </View>
  );
}