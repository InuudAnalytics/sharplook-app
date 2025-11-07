import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Alert,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import AuthButton from "../../reusuableComponents/buttons/AuthButton";
import OutlineButton from "../../reusuableComponents/buttons/OutlineButton";
import BottomModal from "../../reusuableComponents/BottomModal";
import { HttpClient } from "../../../api/HttpClient";
import { showToast } from "../../ToastComponent/Toast";
import { formatAmount } from "../../formatAmount";
import { useAuth } from "../../../context/AuthContext";
import {
  DateConverter,
  formatDateToDDMMYYYY,
} from "../../reusuableComponents/DateConverter";

import Checkg from '../../../assets/icon/check-circle.svg'
import Checkx from '../../../assets/icon/x-circle.svg'
import Left from '../../../assets/icon/left.svg'

export default function SubscriptionScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [paystackModalVisible, setPaystackModalVisible] = useState(false);
  const [paystackPaymentUrl, setPaystackPaymentUrl] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingSubscriptionValues, setPendingSubscriptionValues] = useState(
    {}
  );
  const [subLoading, setSubLoading] = useState(false);

  const [subscription, setSubscription] = useState(null);
  const getSub = async () => {
    setSubLoading(true);
    try {
      const res = await HttpClient.get("/vendor/getMySub");
      setSubscription(res.data);
    } catch (error) {
      console.error("Error fetching subscription:", error);
      setSubscription(null);
    } finally {
      setSubLoading(false);
    }
  };
  useEffect(() => {
    getSub();
  }, []);
  // Subscription plan details
  const subscriptionPlan = {
    name: "In-shop Vendor Monthly Plan",
    price: 5000, // ₦5,000 in kobo
    duration: "1 month",
    benefits: [
      "List unlimited services",
      "Get discovered by more clients",
      "Advanced analytics dashboard",
      "Priority Customer Support (24/7)",
    ],
  };

  const handleRenewSubscription = () => {
    setShowPaymentModal(true);
  };

  const handlePaystackPayment = async () => {
    setShowPaymentModal(false);
    setLoading(true);
    setPendingSubscriptionValues({ paymentMethod: "PAYSTACK" });
    await initiatePaystackPayment();
  };

  const handleSharpPayPayment = async () => {
    setShowPaymentModal(false);
    setLoading(true);

    const payload = {
      planName: "Standard Monthly",
      amount: subscriptionPlan.price,
    };

    try {
      const res = await HttpClient.post("/vendor/mark-vendor-paid", payload);

      showToast.success(res.data.message);
      navigation.goBack();
    } catch (error) {
      if (error.response?.data?.message === "Insufficient wallet balance") {
        showToast.error(error.response.data.message);
      } else {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          error.response?.message;
        showToast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const initiatePaystackPayment = async () => {
    try {
      const res = await HttpClient.post("/payment/paystack/initiate", {
        paymentFor: "SUBSCRIPTION",
        description: `Payment for ${subscriptionPlan.name}`,
        amount: subscriptionPlan.price,
      });
      setPaystackPaymentUrl(res.data.paymentUrl);
      setPaymentReference(res.data.reference);
      setPaystackModalVisible(true);
    } catch (error) {
      showToast.error("Failed to initiate payment");
      setLoading(false);
    }
  };

  const handlePaystackVerificationAndSubscription = async (reference) => {
    if (!reference) {
      showToast.error("No payment reference found.");
      return;
    }
    setLoading(true);
    try {
      const verifyRes = await HttpClient.get(
        `/payment/paystack/verify/${reference}`
      );

      if (verifyRes.data.transaction.status === "paid") {
        const subscriptionPayload = {
          userId: user.id,
          planName: "Standard Monthly",
          amount: subscriptionPlan.price,
        };

        const subscriptionRes = await HttpClient.post(
          "/vendor/mark-vendor-paid",
          subscriptionPayload
        );

        showToast.success(subscriptionRes.data.message);
        navigation.goBack();
      } else {
        showToast.error("Payment verification failed");
      }
      setPaystackModalVisible(false);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Payment verification or subscription renewal failed.";
      showToast.error(message);
    } finally {
      setLoading(false);
      setPaymentReference("");
    }
  };

  // Show loader while fetching subscription data
  if (subLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#EB278D" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#FFFAFD]">
      {/* Header */}
      <StatusBar backgroundColor="#EB278D" barStyle="light-content" />
      <View className="pt-[60px] pb-4 px-4 bg-[#FFFAFD] flex-row items-center justify-between shadow-sm">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Left name="chevron-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text
          className="flex-1 text-center text-[16px]"
          style={{ fontFamily: "poppinsMedium" }}
        >
          My Subscription
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Subscription Details Card */}
        <View style={styles.card}>
          {/* Subscription Status */}
          <View className="flex-row px-4 py-4 items-center mb-3 border-b border-[#EBEBEA]">
            <View className="w-4 h-4 bg-red-500 rounded-full items-center justify-center mr-2">
              {subscription?.subscription ? (
                <Checkg name="checkcircleo" width={15} height={20} color="#EB278D" />
              ) : (
                <Checkx name="closecircleo" width={15} height={20} color="red" />
              )}
            </View>
            {subscription?.subscription ? (
              <Text
                className="text-primary text-[16px]"
                style={{ fontFamily: "poppinsMedium" }}
              >
                Subscription Active
              </Text>
            ) : (
              <Text
                className="text-[#FF383C] text-[16px]"
                style={{ fontFamily: "poppinsMedium" }}
              >
                Subscription Expired
              </Text>
            )}
          </View>

          {/* Plan Name */}
          <View className="px-4 pt-3 pb-5">
            <Text
              className="text-[16px] mb-4"
              style={{ fontFamily: "poppinsMedium" }}
            >
              {subscriptionPlan.name}
            </Text>

            {/* Dates */}
            {subscription?.subscription && (
              <View className="space-y-2">
                <View className="flex-row justify-between items-center">
                  <Text
                    className="text-[14px] text-[#8C8D8B]"
                    style={{ fontFamily: "poppinsRegular" }}
                  >
                    Start Date:
                  </Text>
                  <Text
                    className="text-[14px]"
                    style={{ fontFamily: "poppinsMedium" }}
                  >
                    {DateConverter(subscription?.subscription?.paidAt)}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text
                    className="text-[14px] text-[#8C8D8B]"
                    style={{ fontFamily: "poppinsRegular" }}
                  >
                    End Date:
                  </Text>
                  <Text
                    className="text-[14px]"
                    style={{ fontFamily: "poppinsMedium" }}
                  >
                    {DateConverter(subscription?.subscription?.expiresAt)}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Plan Benefits Card */}
        <View style={styles.card}>
          <View className="px-4 py-3 border-b border-[#EBEBEA] ">
            <Text
              className="text-[16px] text-gray-800"
              style={{ fontFamily: "poppinsMedium" }}
            >
              Plan Benefits
            </Text>
          </View>
          <View className="space-y-2 px-4 pt-3 pb-5">
            {subscriptionPlan.benefits.map((benefit, index) => (
              <Text
                key={index}
                className="text-[14px] text-[#8C8D8B] text-center"
                style={{ fontFamily: "poppinsRegular" }}
              >
                {benefit}
              </Text>
            ))}
          </View>
        </View>

        {/* Total Payment */}

        {/* Action Buttons */}
        <View className="mt-8 mb-6 space-y-3">
          {/* Renew Subscription Button */}
          <AuthButton
            disabled={
              subscription?.subscription?.isPaid ||
              (subscription && !subscription.subscription)
            }
            title="Renew Subscription"
            onPress={handleRenewSubscription}
            isloading={loading}
            loadingMsg="Processing..."
          />
        </View>
      </ScrollView>

      {/* Payment Method Modal */}
      <BottomModal
        isVisible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        showCloseBtn={true}
      >
        <View className="mb-8 mt-2">
          <Text
            className="text-[18px] text-fadedDark"
            style={{ fontFamily: "latoBold" }}
          >
            Payment Method
          </Text>
        </View>
        <View className="space-y-4 pb-10 mt-2">
          <OutlineButton
            positionLeft
            onPress={handlePaystackPayment}
            title="Paystack"
            icon={<Ionicons name="card-outline" size={28} color="#EB278D" />}
          />
          <OutlineButton
            positionLeft
            onPress={handleSharpPayPayment}
            title="SharpPay"
            icon={<Ionicons name="wallet-outline" size={28} color="#EB278D" />}
          />
        </View>
      </BottomModal>

      {/* Paystack WebView Modal */}
      <Modal
        visible={paystackModalVisible}
        animationType="slide"
        onRequestClose={() => setPaystackModalVisible(false)}
        transparent={false}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <View style={{ width: 24 }} />
            <Text style={styles.headerTitle}>Payment</Text>
            <TouchableOpacity
              onPress={() => setPaystackModalVisible(false)}
              style={{ padding: 8 }}
            >
              <Ionicons name="close" size={24} color="#222" />
            </TouchableOpacity>
          </View>
          {paystackPaymentUrl ? (
            <>
              <WebView
                source={{ uri: paystackPaymentUrl }}
                onNavigationStateChange={(navState) => {
                  // Detect Paystack close or success URL
                  if (
                    navState.url.includes("paystack.com/close") ||
                    navState.url.includes("payment/success")
                  ) {
                    // Try to extract reference from URL if possible
                    const refMatch = navState.url.match(
                      /[?&]reference=([^&#]+)/
                    );
                    const reference = refMatch ? refMatch[1] : paymentReference;
                    setPaystackModalVisible(false);
                    setPaystackPaymentUrl("");
                    if (reference) {
                      handlePaystackVerificationAndSubscription(reference);
                    } else {
                      Alert.alert(
                        "Payment",
                        "Payment completed, but reference not found."
                      );
                    }
                  }
                }}
                startInLoadingState
                style={{ flex: 1 }}
              />
              <View style={styles.verifyButtonContainer}>
                <Text className="text-center font-medium text-primary pb-2">
                  Click "Verify payment" after payment to verify
                </Text>
                <AuthButton
                  onPress={() => {
                    setPaystackModalVisible(false);
                    handlePaystackVerificationAndSubscription(paymentReference);
                  }}
                  title="Verify Payment"
                />
              </View>
            </>
          ) : null}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 1,
    elevation: 1,
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingBottom: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    color: "#222",
    fontSize: 14,
    fontFamily: "poppinsMedium",
    flex: 1,
    textAlign: "center",
  },
  verifyButtonContainer: {
    backgroundColor: "#fff",
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
});
