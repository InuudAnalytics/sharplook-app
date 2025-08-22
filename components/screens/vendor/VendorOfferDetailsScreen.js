import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { formatAmount } from "../../formatAmount";
import AuthButton from "../../reusuableComponents/buttons/AuthButton";
import { useAuth } from "../../../context/AuthContext";
import {
  getRelativeTime,
  relativeTime,
} from "../../reusuableComponents/RelativeTime";
import { HttpClient } from "../../../api/HttpClient";
import { showToast } from "../../ToastComponent/Toast";

export default function VendorOfferDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { offer } = route.params || {};
  const [loading, setLoading] = useState(false);
  const offerDetails = offer;
  console.log({ offerDetails });
  const handleAcceptOffer = async () => {
    setLoading(true);
    try {
      const response = await HttpClient.post("/offers/accept", {
        offerId: offer.id,
        price: offerDetails.offerAmount,
      });
      showToast.success(response.data.message);
      navigation.goBack();
    } catch (error) {
      showToast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingTop: 60,
          paddingBottom: 20,
          backgroundColor: "#F9FAFB",
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#1F2937" />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 16,
            fontFamily: "poppinsMedium",
            color: "#1F2937",
          }}
        >
          Offer Details
        </Text>

        <View style={{ width: 26 }} />
      </View>

      {/* Scrollable Content */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Main Content Card */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            marginTop: 16,
            marginBottom: 40,
            borderRadius: 12,
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
          {/* Title */}
          <View
            style={{
              borderBottomWidth: 1,
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderColor: "#EBEBEA",
              paddingTop: 20,
              paddingLeft: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: "poppinsSemiBold",
                color: "#242524",
                marginBottom: 20,
              }}
            >
              Service Offer Details
            </Text>
          </View>

          <View style={{ paddingTop: 20 }}>
            {/* Offer Details */}
            <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "poppinsRegular",
                    color: "#8C8D8B",
                  }}
                >
                  Offer Amount:
                </Text>
                <Text
                  className="text-primary"
                  style={{
                    fontSize: 16,
                    fontFamily: "poppinsMedium",
                  }}
                >
                  {formatAmount(offerDetails.offerAmount)}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "poppinsRegular",
                    color: "#8C8D8B",
                  }}
                >
                  Service:
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "poppinsMedium",
                    color: "#242524",
                  }}
                >
                  {offerDetails.serviceName}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "poppinsRegular",
                    color: "#8C8D8B",
                  }}
                >
                  Service Type:
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "poppinsMedium",
                    color: "#242524",
                  }}
                >
                  {offerDetails.serviceType === "HOME_SERVICE"
                    ? "Home Service"
                    : "In-Shop"}
                </Text>
              </View>
            </View>

            {/* Service Image */}
            <View style={{ paddingHorizontal: 20 }}>
              <Image
                source={{ uri: offerDetails.serviceImage }}
                style={{
                  width: "100%",
                  height: 200,
                  borderRadius: 8,
                  marginBottom: 20,
                  resizeMode: "cover",
                }}
              />
            </View>

            {/* Client and Posted Info */}
            <View
              style={{
                padding: 20,
                borderTopWidth: 1,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderColor: "#EBEBEA",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "poppinsRegular",
                    color: "#8C8D8B",
                  }}
                >
                  Client:
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "poppinsMedium",
                    color: "#242524",
                  }}
                >
                  {offerDetails.client.lastName} {offerDetails.client.firstName}
                </Text>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "poppinsRegular",
                    color: "#8C8D8B",
                  }}
                >
                  Posted:
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "poppinsMedium",
                    color: "#242524",
                  }}
                >
                  {getRelativeTime(offerDetails.createdAt)}
                </Text>
              </View>
            </View>

            {/* Home Service Additional Info */}
            {offerDetails.serviceType === "HOME_SERVICE" && (
              <View
                style={{
                  padding: 20,
                  borderTopWidth: 1,
                  borderLeftWidth: 1,
                  borderRightWidth: 1,
                  borderColor: "#EBEBEA",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View className="w-1/2">
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "poppinsRegular",
                      color: "#8C8D8B",
                    }}
                  >
                    Client:
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "poppinsMedium",
                      color: "#242524",
                    }}
                  >
                    {offerDetails.client.lastName}{" "}
                    {offerDetails.client.firstName}
                  </Text>
                </View>

                <View style={{ alignItems: "flex-end" }} className="w-1/2">
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "poppinsRegular",
                      color: "#8C8D8B",
                    }}
                  >
                    Client's Location:
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "poppinsMedium",
                      color: "#242524",
                    }}
                  >
                    {offerDetails?.fullAddress}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 50 }}>
        <AuthButton
          title="Accept Offer"
          onPress={handleAcceptOffer}
          isloading={loading}
        />
      </View>
    </View>
  );
}
