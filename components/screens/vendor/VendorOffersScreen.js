import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { formatAmount } from "../../formatAmount";
import { DateConverter } from "../../reusuableComponents/DateConverter";
import { HttpClient } from "../../../api/HttpClient";
import { useAuth } from "../../../context/AuthContext";
import { EmptyData } from "../../reusuableComponents/EmptyData";

import Left from '../../../assets/icon/left.svg'

// Skeleton Loader Component
const SkeletonCard = () => (
  <View
    style={{
      backgroundColor: "#FFFFFF",
      marginHorizontal: 16,
      marginTop: 12,
      borderRadius: 12,
      padding: 16,
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
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View style={{ flex: 1 }}>
        {/* Service Name Skeleton */}
        <View
          style={{
            height: 16,
            backgroundColor: "#E5E7EB",
            borderRadius: 4,
            marginBottom: 8,
            width: "80%",
          }}
        />
        {/* Client Name Skeleton */}
        <View
          style={{
            height: 12,
            backgroundColor: "#F3F4F6",
            borderRadius: 4,
            marginBottom: 8,
            width: "60%",
          }}
        />
        {/* Price Skeleton */}
        <View
          style={{
            height: 16,
            backgroundColor: "#E5E7EB",
            borderRadius: 4,
            width: "40%",
          }}
        />
      </View>

      <View style={{ alignItems: "flex-end" }}>
        {/* Service Type Badge Skeleton */}
        <View
          style={{
            height: 24,
            backgroundColor: "#F3F4F6",
            borderRadius: 8,
            marginBottom: 8,
            width: 80,
          }}
        />
        {/* Date Skeleton */}
        <View
          style={{
            height: 12,
            backgroundColor: "#F3F4F6",
            borderRadius: 4,
            width: 60,
          }}
        />
      </View>
    </View>
  </View>
);

const SkeletonLoader = () => (
  <ScrollView
    style={{ flex: 1, backgroundColor: "#F9FAFB" }}
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{ paddingBottom: 20 }}
  >
    {[1, 2, 3, 4, 5].map((index) => (
      <SkeletonCard key={index} />
    ))}
  </ScrollView>
);

export default function VendorOffersScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("nearby"); // "nearby" or "all"
  const [myOffers, setMyOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const getMyOffers = async (tabType = "nearby") => {
    setLoading(true);
    try {
      const endpoint =
        tabType === "nearby" ? "/offers/nearbyOffers" : "/offers/allOffers";
      const res = await HttpClient.get(endpoint);
      setMyOffers(res.data.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    getMyOffers(tab);
  };

  useFocusEffect(
    useCallback(() => {
      getMyOffers(activeTab);
    }, [activeTab])
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingTop: 60,
          paddingBottom: 20,
          backgroundColor: "#FFFFFF",
          borderBottomWidth: 1,
          borderBottomColor: "#F3F4F6",
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Left name="chevron-back" size={24} color="#1F2937" />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 16,
            fontFamily: "poppinsMedium",
            color: "#1F2937",
          }}
        >
          My Offers
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ width: 26 }} />
        </View>
      </View>

      {/* Filter Tabs */}
      <View
        className="bg-[#E9E9E980] mt-6 rounded-[8px] py-3 mx-4"
        style={{
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          onPress={() => handleTabChange("nearby")}
          style={{
            flex: 1,
            paddingVertical: 8,
            paddingHorizontal: 10,
            marginHorizontal: 4,
            borderRadius: 8,
            backgroundColor: activeTab === "nearby" ? "#ED2584" : "transparent",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 14,
              fontFamily: "poppinsRegular",
              color: activeTab === "nearby" ? "#FFFFFF" : "#6B7280",
            }}
          >
            Nearby Offers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleTabChange("all")}
          style={{
            flex: 1,
            paddingVertical: 8,
            paddingHorizontal: 10,
            marginHorizontal: 4,
            borderRadius: 8,
            backgroundColor: activeTab === "all" ? "#ED2584" : "transparent",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 14,
              fontFamily: "poppinsRegular",
              color: activeTab === "all" ? "#FFFFFF" : "#6B7280",
            }}
          >
            All Offers
          </Text>
        </TouchableOpacity>
      </View>

      {/* Offers List */}
      {loading ? (
        <SkeletonLoader />
      ) : myOffers.length === 0 ? (
        <EmptyData msg="No offers found" />
      ) : (
        <ScrollView
          style={{ flex: 1, backgroundColor: "#F9FAFB" }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {myOffers
            .filter((offer) => {
              // Filter based on user's vendor onboarding service type
              if (user?.vendorOnboarding?.serviceType === "HOME_SERVICE") {
                return offer?.serviceType === "HOME_SERVICE";
              } else {
                return offer?.serviceType === "IN_SHOP";
              }
            })
            .sort((a, b) => {
              // Sort by createdAt in descending order (newest first)
              const dateA = new Date(a.createdAt);
              const dateB = new Date(b.createdAt);
              return dateB - dateA;
            })
            .map((offer) => (
              <TouchableOpacity
                key={offer.id}
                onPress={() =>
                  navigation.navigate("VendorOfferDetails", { offer })
                }
                style={{
                  backgroundColor: "#FFFFFF",
                  marginHorizontal: 16,
                  marginTop: 12,
                  borderRadius: 12,
                  padding: 16,
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
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: "poppinsMedium",
                        color: "#1F2937",
                        marginBottom: 4,
                      }}
                    >
                      {offer?.serviceName}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: "poppinsRegular",
                        color: "#8C8D8B",
                        marginBottom: 4,
                      }}
                    >
                      {offer?.client?.lastName} {offer?.client?.firstName}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: "poppinsMedium",
                        color: "#ED2584",
                      }}
                    >
                      {formatAmount(offer?.offerAmount)}
                    </Text>
                  </View>

                  <View style={{ alignItems: "flex-end" }}>
                    <View
                      style={{
                        backgroundColor: "#FDF2F8",
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: "#ED2584",
                        marginBottom: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: "poppinsMedium",
                          color: "#ED2584",
                        }}
                      >
                        {offer.serviceType === "HOME_SERVICE"
                          ? "Home Service"
                          : "In-Shop"}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "poppinsRegular",
                        color: "#9CA3AF",
                      }}
                    >
                      {DateConverter(offer.date)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

          {myOffers.filter((offer) => {
            if (user?.vendorOnboarding?.serviceType === "HOME_SERVICE") {
              return offer?.serviceType === "HOME_SERVICE";
            } else {
              return offer?.serviceType === "IN_SHOP";
            }
          }).length === 0 && (
            <EmptyData
              msg={`No ${
                user?.vendorOnboarding?.serviceType === "HOME_SERVICE"
                  ? "home service"
                  : "in-shop"
              } offers found`}
            />
          )}
        </ScrollView>
      )}
    </View>
  );
}
