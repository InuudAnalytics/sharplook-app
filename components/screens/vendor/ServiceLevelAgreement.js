import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function ServiceLevelAgreementScreen() {
  const navigation = useNavigation();
  const handleEmailPress = () => {
    Linking.openURL("mailto:hello@sharplook.beauty");
  };
  return (
    <View className="flex-1 bg-white pb-[50px]">
      {/* Header */}
      <View className="pt-[60px] pb-4 px-4 flex-row items-center shadow-sm mb-5 justify-between bg-white">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#201E1F" />
        </TouchableOpacity>
        <Text
          style={{ fontFamily: "latoBold" }}
          className="text-[16px] text-faintDark"
        >
          Service Level Agreement
        </Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Document Header */}
        <View className="rounded-2xl p-6 mb-6 border border-[#eb278c35]">
          <Text
            className="text-[24px] text-gray-800 mb-2"
            style={{ fontFamily: "poppinsBold" }}
          >
            Service Level Agreement
          </Text>
          <Text
            className="text-[14px] text-gray-600 mb-4"
            style={{ fontFamily: "poppinsMedium" }}
          >
            Last updated: August 5th, 2025
          </Text>
          <View className="flex-row items-center">
            <View className="bg-[#eb278c25] p-2 rounded-[20px] mr-3">
              <MaterialIcons name="handshake" size={20} color="#EB278D" />
            </View>
            <Text
              className="text-[14px] text-gray-700 flex-1"
              style={{ fontFamily: "poppinsRegular" }}
            >
              Performance standards and service obligations between vendors and
              users
            </Text>
          </View>
        </View>

        {/* Introduction Section */}
        <View className="mb-6">
          <Text
            className="text-[16px] text-gray-800 leading-7 mb-4"
            style={{ fontFamily: "poppinsRegular" }}
          >
            This Service Level Agreement outlines the minimum performance
            standards, service obligations, and responsibilities between
            registered Vendors and Users of the Sharplook mobile application
            ("Platform").
          </Text>
        </View>

        {/* Section 1: Scope of Services */}
        <View className="mb-6">
          <View className="flex-row items-center mb-3">
            <View className="bg-primary w-8 h-8 rounded-full items-center justify-center mr-3">
              <Text
                className="text-white text-[14px]"
                style={{ fontFamily: "poppinsBold" }}
              >
                1
              </Text>
            </View>
            <Text
              className="text-[18px] text-gray-800"
              style={{ fontFamily: "poppinsBold" }}
            >
              Scope of Services
            </Text>
          </View>
          <Text
            className="text-[15px] text-gray-700 leading-6 ml-11"
            style={{ fontFamily: "poppinsRegular" }}
          >
            Vendors agree to provide beauty, wellness, and therapeutic services
            professionally and in accordance with service descriptions
            advertised on the Platform. Users agree to book and receive services
            in good faith and within the stated terms provided by each Vendor.
          </Text>
        </View>

        {/* Section 2: Service Availability & Response Times */}
        <View className="mb-6">
          <View className="flex-row items-center mb-3">
            <View className="bg-primary w-8 h-8 rounded-full items-center justify-center mr-3">
              <Text
                className="text-white text-[14px]"
                style={{ fontFamily: "poppinsBold" }}
              >
                2
              </Text>
            </View>
            <Text
              className="text-[18px] text-gray-800"
              style={{ fontFamily: "poppinsBold" }}
            >
              Service Availability & Response Times
            </Text>
          </View>
          <Text
            className="text-[15px] text-gray-700 leading-6 ml-11 mb-3"
            style={{ fontFamily: "poppinsRegular" }}
          >
            To ensure a seamless and reliable experience for Users, all Service
            Providers ("Vendors") on the Sharp Look platform are required to
            uphold high standards of availability and communication.
          </Text>

          <View className="ml-11">
            <View className="rounded-xl p-4 mb-3 border border-[#eb278c35]">
              <Text
                className="text-[16px] text-gray-800 mb-2"
                style={{ fontFamily: "poppinsSemiBold" }}
              >
                Schedule Management
              </Text>
              <Text
                className="text-[15px] text-gray-700 leading-6"
                style={{ fontFamily: "poppinsRegular" }}
              >
                Vendors must maintain an up-to-date schedule reflecting their
                accurate service availability. This includes real-time updates
                to their booking calendar, service offerings, and hours of
                operation.
              </Text>
            </View>

            <View className="rounded-xl p-4 mb-3 border border-[#eb278c35]">
              <Text
                className="text-[16px] text-gray-800 mb-2"
                style={{ fontFamily: "poppinsSemiBold" }}
              >
                Response Time Requirements
              </Text>
              <Text
                className="text-[15px] text-gray-700 leading-6"
                style={{ fontFamily: "poppinsRegular" }}
              >
                Vendors are expected to respond to all booking requests,
                inquiries, and appointment modifications within a maximum of 10
                minutes. Failure to do so may result in reduced visibility
                within search results or platform notifications.
              </Text>
            </View>

            <View className="rounded-xl p-4 mb-3 border border-[#eb278c35]">
              <Text
                className="text-[16px] text-gray-800 mb-2"
                style={{ fontFamily: "poppinsSemiBold" }}
              >
                Communication Protocols
              </Text>
              <Text
                className="text-[15px] text-gray-700 leading-6"
                style={{ fontFamily: "poppinsRegular" }}
              >
                In the event of unforeseen circumstances such as delays,
                cancellations, or changes in availability, Vendors must promptly
                notify affected Users through the Platform's messaging system or
                communication tools.
              </Text>
            </View>
          </View>
        </View>

        {/* Section 3: Appointment Confirmation and Location Compliance */}
        <View className="mb-6">
          <View className="flex-row items-center mb-3">
            <View className="bg-primary w-8 h-8 rounded-full items-center justify-center mr-3">
              <Text
                className="text-white text-[14px]"
                style={{ fontFamily: "poppinsBold" }}
              >
                3
              </Text>
            </View>
            <Text
              className="text-[18px] text-gray-800"
              style={{ fontFamily: "poppinsBold" }}
            >
              Appointment Confirmation and Location Compliance
            </Text>
          </View>
          <Text
            className="text-[15px] text-gray-700 leading-6 ml-11 mb-3"
            style={{ fontFamily: "poppinsRegular" }}
          >
            To uphold a reliable and secure experience for all users of the
            Sharp Look platform, Vendors are required to adhere strictly to
            appointment protocols and location-based responsibilities.
          </Text>

          <View className="ml-11">
            <View className="rounded-xl p-4 mb-3 border border-[#eb278c35]">
              <Text
                className="text-[16px] text-gray-800 mb-2"
                style={{ fontFamily: "poppinsSemiBold" }}
              >
                Prompt Appointment Confirmation
              </Text>
              <Text
                className="text-[15px] text-gray-700 leading-6"
                style={{ fontFamily: "poppinsRegular" }}
              >
                Vendors must promptly review and confirm all appointment
                requests received through the platform. Confirmations should be
                issued within a reasonable timeframe to ensure planning
                efficiency and user confidence.
              </Text>
            </View>

            <View className="rounded-xl p-4 mb-3 border border-[#eb278c35]">
              <Text
                className="text-[16px] text-gray-800 mb-2"
                style={{ fontFamily: "poppinsSemiBold" }}
              >
                Timely Arrival
              </Text>
              <Text
                className="text-[15px] text-gray-700 leading-6"
                style={{ fontFamily: "poppinsRegular" }}
              >
                Vendors are expected to arrive at the specified appointment
                location at or before the scheduled time. Excessive lateness or
                habitual tardiness may result in performance reviews, reduced
                visibility on the platform, or disciplinary action.
              </Text>
            </View>

            <View className="rounded-xl p-4 mb-3 border border-[#eb278c35]">
              <Text
                className="text-[16px] text-gray-800 mb-2"
                style={{ fontFamily: "poppinsSemiBold" }}
              >
                Mandatory Location Services
              </Text>
              <Text
                className="text-[15px] text-gray-700 leading-6"
                style={{ fontFamily: "poppinsRegular" }}
              >
                For safety, operational integrity, and location verification,
                Vendors must keep device location services enabled throughout
                any active appointment. This enables real-time monitoring for
                compliance and facilitates support in case of emergency.
              </Text>
            </View>

            <View className="rounded-xl p-4 mb-3 border border-[#eb278c35]">
              <Text
                className="text-[16px] text-gray-800 mb-2"
                style={{ fontFamily: "poppinsSemiBold" }}
              >
                Location Updates and Change Logging
              </Text>
              <Text
                className="text-[15px] text-gray-700 leading-6"
                style={{ fontFamily: "poppinsRegular" }}
              >
                If a User modifies the appointment location prior to the
                session, the Vendor must immediately acknowledge and record the
                updated details within the Platform before initiating the
                service. This ensures alignment between both parties and
                maintains a verifiable record of service changes.
              </Text>
            </View>

            <View className="rounded-xl p-4 mb-3 border border-[#eb278c35]">
              <Text
                className="text-[16px] text-gray-800 mb-2"
                style={{ fontFamily: "poppinsSemiBold" }}
              >
                Non-Compliance Consequences
              </Text>
              <Text
                className="text-[15px] text-gray-700 leading-6"
                style={{ fontFamily: "poppinsRegular" }}
              >
                Repeated failure to follow location protocols, including
                disabling location services, ignoring updates, or failing to
                arrive at the designated site, may lead to temporary suspension,
                reduced visibility, or termination from the Platform.
              </Text>
            </View>
          </View>
        </View>

        {/* Section 4: Service Delivery Options and Pricing Structure */}
        <View className="mb-6">
          <View className="flex-row items-center mb-3">
            <View className="bg-primary w-8 h-8 rounded-full items-center justify-center mr-3">
              <Text
                className="text-white text-[14px]"
                style={{ fontFamily: "poppinsBold" }}
              >
                4
              </Text>
            </View>
            <Text
              className="text-[18px] text-gray-800"
              style={{ fontFamily: "poppinsBold" }}
            >
              Service Delivery Options and Pricing Structure
            </Text>
          </View>
          <Text
            className="text-[15px] text-gray-700 leading-6 ml-11 mb-3"
            style={{ fontFamily: "poppinsRegular" }}
          >
            The Sharp Look Platform offers two distinct service delivery modes
            designed to cater to user preferences and convenience. Each mode
            features its own pricing framework, which Vendors must clearly
            display and maintain within the platform.
          </Text>

          <View className="ml-11">
            <View className="rounded-xl p-4 mb-3 border border-[#eb278c35]">
              <Text
                className="text-[16px] text-gray-800 mb-2"
                style={{ fontFamily: "poppinsSemiBold" }}
              >
                Walk-In Services
              </Text>
              <Text
                className="text-[15px] text-gray-700 leading-6"
                style={{ fontFamily: "poppinsRegular" }}
              >
                This option allows Users to visit the Vendor's designated
                location or storefront to receive services. Pricing for walk-in
                appointments should reflect standard service rates. Vendors are
                responsible for maintaining accurate business addresses and
                available walk-in hours within the Platform.
              </Text>
            </View>

            <View className="rounded-xl p-4 mb-3 border border-[#eb278c35]">
              <Text
                className="text-[16px] text-gray-800 mb-2"
                style={{ fontFamily: "poppinsSemiBold" }}
              >
                Home or Office Services
              </Text>
              <Text
                className="text-[15px] text-gray-700 leading-6"
                style={{ fontFamily: "poppinsRegular" }}
              >
                For added convenience, Users may opt for services delivered to a
                specified location, including residential homes or commercial
                offices. Pricing for this delivery mode may be higher than
                walk-in rates and may account for factors such as travel time,
                logistics, and additional service setup. Vendors are expected to
                disclose all associated fees transparently and ensure that
                location details are accurately maintained.
              </Text>
            </View>
          </View>
        </View>

        {/* Section 5: Quality Standards */}
        <View className="mb-6">
          <View className="flex-row items-center mb-3">
            <View className="bg-primary w-8 h-8 rounded-full items-center justify-center mr-3">
              <Text
                className="text-white text-[14px]"
                style={{ fontFamily: "poppinsBold" }}
              >
                5
              </Text>
            </View>
            <Text
              className="text-[18px] text-gray-800"
              style={{ fontFamily: "poppinsBold" }}
            >
              Quality Standards
            </Text>
          </View>
          <Text
            className="text-[15px] text-gray-700 leading-6 ml-11"
            style={{ fontFamily: "poppinsRegular" }}
          >
            All services must meet industry standards for quality and safety.
            Vendors are responsible for maintaining proper licensing, insurance,
            and compliance with local health and safety regulations. Regular
            quality assessments may be conducted to ensure service standards are
            maintained.
          </Text>
        </View>

        {/* Section 6: Dispute Resolution */}
        <View className="mb-6">
          <View className="flex-row items-center mb-3">
            <View className="bg-primary w-8 h-8 rounded-full items-center justify-center mr-3">
              <Text
                className="text-white text-[14px]"
                style={{ fontFamily: "poppinsBold" }}
              >
                6
              </Text>
            </View>
            <Text
              className="text-[18px] text-gray-800"
              style={{ fontFamily: "poppinsBold" }}
            >
              Dispute Resolution
            </Text>
          </View>
          <Text
            className="text-[15px] text-gray-700 leading-6 ml-11"
            style={{ fontFamily: "poppinsRegular" }}
          >
            In the event of service disputes, both parties agree to work through
            the Platform's dispute resolution process. This includes providing
            evidence, responding to inquiries, and accepting the final decision
            of the Platform's resolution team.
          </Text>
        </View>

        {/* Contact Information */}
        <View className="rounded-2xl p-6 mb-6 border border-[#eb278c35]">
          <View className="flex-row items-center mb-3">
            <View className="bg-primary p-2 rounded-[20px] mr-3">
              <Ionicons name="mail" size={20} color="#fff" />
            </View>
            <Text
              className="text-[16px] text-gray-800"
              style={{ fontFamily: "poppinsSemiBold" }}
            >
              Contact Us
            </Text>
          </View>
          <Text
            className="text-[15px] text-gray-700 leading-6 mb-3"
            style={{ fontFamily: "poppinsRegular" }}
          >
            If you have any questions about this Service Level Agreement, please
            contact us at:
          </Text>
          <TouchableOpacity
            onPress={handleEmailPress}
            className="flex-row items-center"
          >
            <Text
              className="text-primary text-[15px] underline"
              style={{ fontFamily: "poppinsMedium" }}
            >
              hello@sharplook.beauty
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
