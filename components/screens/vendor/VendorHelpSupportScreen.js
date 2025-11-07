import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Linking,
  ScrollView,
} from "react-native";
import {
  Ionicons,
  FontAwesome,
  Entypo,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import TawkToChat from "../../TawkToChat";
import { useAuth } from "../../../context/AuthContext";

export default function HelpSupportScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [chatVisible, setChatVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // TODO: Replace with actual vendor info from context or props
  const vendorName = `${user?.vendorOnboarding?.businessName}`;
  const vendorEmail = user?.email;
  const vendorPhone = user?.phone || user?.vendor?.phone || ""; // Add phone from user data
  const vendorAvatar = user?.avatar || ""; // Add avatar from user data
  const vendorRole = "vendor";

  const handleChatOpen = () => {
    setChatVisible(true);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 10000);
  };

  const handleChatClose = () => {
    setChatVisible(false);
    setIsLoading(true);
  };

  const handleChatLoad = () => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };
  const handleEmailPress = () => {
    Linking.openURL("mailto:hello@sharplook.beauty");
  };

  // Get Started data
  const getStartedData = [
    {
      id: 1,
      title: "Creating an account",
      content:
        "Sign up using your email, phone number, or social media account. Fill in your basic details, verify your phone number, and you're ready to start booking or offering services.",
    },
    {
      id: 2,
      title: "Navigating the app",
      content:
        "From the home screen, browse services, view top vendors, check promotions, and manage your bookings. Use the menu to access your profile, wallet, chat, and settings.",
    },
  ];

  // Payment data
  const paymentData = [
    {
      id: 1,
      title: "Accepted payment methods",
      content:
        "We accept card payments, bank transfers, USSD, and wallet balance.",
    },
    {
      id: 2,
      title: "Funding your wallet",
      content:
        'Go to "SharpPay" → "Fund Wallet" → Choose Paystack and follow the payment steps.',
    },
    {
      id: 3,
      title: "Payment security & refunds",
      content:
        "All transactions are secure. Refunds are processed based on our policy if services aren't delivered.",
    },
  ];

  // Booking System data
  const bookingSystemData = [
    {
      id: 1,
      title: "How to book a vendor",
      content:
        "Search for a vendor, view their profile, choose a service, and pick a date and time.",
    },
    {
      id: 2,
      title: "Cancelling a booking",
      content:
        "Cancel anytime before the service date from your booking details page.",
    },
    {
      id: 3,
      title: "Booking statuses",
      content: [
        "Pending – awaiting vendor's confirmation",
        "Accepted – vendor has accepted",
        "Completed – service is done",
      ],
    },
  ];

  // Reusable card component
  const HelpCard = ({ title, content, icon }) => (
    <View className="bg-white rounded-xl px-4 py-4 mb-3 shadow-sm border border-[#F6F6F6]">
      <View className="flex-row items-center">
        <View className="flex-1">
          <Text
            className="text-[16px] mb-1"
            style={{ fontFamily: "poppinsSemiBold" }}
          >
            {title}
          </Text>
          {Array.isArray(content) ? (
            content.map((line, index) => (
              <Text
                key={index}
                className="text-[12px] text-[#00000080]"
                style={{ fontFamily: "poppinsRegular" }}
              >
                {line}
              </Text>
            ))
          ) : (
            <Text
              className="text-[12px] text-[#00000080]"
              style={{ fontFamily: "poppinsRegular" }}
            >
              {content}
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="pt-[40px] pb-4 px-4 flex-row items-center shadow-sm mb-5 justify-between bg-white">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#201E1F" />
        </TouchableOpacity>
        <Text
          style={{ fontFamily: "latoBold" }}
          className="text-[14px] text-faintDark"
        >
          Help and Support
        </Text>
        <View style={{ width: 26 }} />
      </View>
      <ScrollView>
        {/* Help Topics */}
        <View className="px-4 mt-4">
          {/* Get Started Section */}
          <View className="items-center">
            <Text
              className="text-[14px] text-[#555] mb-3"
              style={{ fontFamily: "poppinsRegular" }}
            >
              We are ready to hear from you via email
            </Text>
            <View className="flex-row justify-center gap-[40px] items-center mb-4">
              <TouchableOpacity onPress={handleEmailPress}>
                <Text className="text-primary underline">
                  hello@sharplook.beauty
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            {getStartedData.map((item) => (
              <HelpCard
                key={item.id}
                title={item.title}
                content={item.content}
                icon={item.icon}
              />
            ))}
          </View>

          {/* Payment Section */}
          <View>
            {paymentData.map((item) => (
              <HelpCard
                key={item.id}
                title={item.title}
                content={item.content}
                icon={item.icon}
              />
            ))}
          </View>

          {/* Booking System Section */}
          <View className="mb-6">
            {bookingSystemData.map((item) => (
              <HelpCard
                key={item.id}
                title={item.title}
                content={item.content}
                icon={item.icon}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* <View className="absolute bottom-[85px] right-4">
        <View className="items-center">
          <TouchableOpacity
            onPress={handleChatOpen}
            className="items-center justify-center bg-primary h-[40px] w-[40px] rounded-full mt-2"
          >
            <Entypo name="chat" size={22} color="#fff" />
          </TouchableOpacity>
          <Text
            className="text-center text-[14px] mt-2"
            style={{ fontFamily: "latoBold" }}
          >
            Live Chat
          </Text>
        </View>
      </View> */}
      <Modal
        visible={chatVisible}
        animationType="slide"
        onRequestClose={handleChatClose}
      >
        <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
          {/* Loading Overlay */}
          {isLoading && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "#f5f5f5",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 20,
              }}
            >
              <ActivityIndicator size="large" color="#EB278D" />
              <Text
                style={{
                  marginTop: 20,
                  fontSize: 16,
                  fontFamily: "poppinsRegular",
                  color: "#666",
                }}
              >
                Loading chat...
              </Text>
            </View>
          )}
          {/* WebView */}
          <TawkToChat
            name={vendorName}
            email={vendorEmail}
            phone={vendorPhone}
            avatar={vendorAvatar}
            role={vendorRole}
            onLoadEnd={handleChatLoad}
          />
          {/* Close Button */}
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 40,
              right: 20,
              zIndex: 30,
              backgroundColor: "#fff",
              borderRadius: 20,
              paddingHorizontal: 20,
              paddingVertical: 8,
              elevation: 2,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
            }}
            onPress={handleChatClose}
          >
            <Text
              style={{ fontSize: 16, color: "#EB278D", fontWeight: "bold" }}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingBottom: 16,
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
    fontSize: 16,
    fontFamily: "poppinsMedium",
    flex: 1,
    textAlign: "center",
    marginLeft: -28,
  },
});
