import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function VendorDataProtectionAgreementScreen() {
  const navigation = useNavigation();
  const handleEmailPress = () => {
    Linking.openURL("mailto:privacy@sharplook.ng");
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
          Data Protection Agreement
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
            Data Protection Agreement
          </Text>
          <Text
            className="text-[14px] text-gray-600 mb-4"
            style={{ fontFamily: "poppinsMedium" }}
          >
            Effective Date: July 24, 2025
          </Text>
          <View className="flex-row items-center">
            <View className="bg-[#eb278c25] p-2 rounded-[20px] mr-3">
              <Ionicons name="lock-closed" size={20} color="#EB278D" />
            </View>
            <Text
              className="text-[14px] text-gray-700 flex-1"
              style={{ fontFamily: "poppinsRegular" }}
            >
              Comprehensive data protection and privacy framework
            </Text>
          </View>
        </View>

        {/* Agreement Parties */}
        <View className="rounded-2xl p-4 mb-6 border border-[#eb278c35]">
          <View className="flex-row items-center mb-2">
            <View className="bg-[#eb278c25] p-2 rounded-[20px] mr-3">
              <Ionicons name="people" size={18} color="#EB278D" />
            </View>
            <Text
              className="text-[16px] text-gray-800"
              style={{ fontFamily: "poppinsSemiBold" }}
            >
              Agreement Parties
            </Text>
          </View>
          <Text
            className="text-[15px] text-gray-700 leading-6"
            style={{ fontFamily: "poppinsRegular" }}
          >
            This Data Protection Agreement ("Agreement") is entered into
            between: FranBoss Dammy Nigeria Limited, a company incorporated in
            Nigeria with its registered office at ……("Company", "we", "us", or
            "our"), the owner and operator of the Sharp Look mobile application
            ("SharpLook App"), AND You, a user of the SharpLook App, either as a
            beauty/wellness service provider or as a client ("User", "you", or
            "your").
          </Text>
        </View>

        {/* Section 1: Definitions */}
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
              Definitions
            </Text>
          </View>

          <View className="ml-11">
            <View className="rounded-xl p-4 mb-3 border border-[#eb278c35]">
              <Text
                className="text-[16px] text-gray-800 mb-2"
                style={{ fontFamily: "poppinsSemiBold" }}
              >
                Key Terms
              </Text>
              <Text
                className="text-[15px] text-gray-700 leading-6 mb-2"
                style={{ fontFamily: "poppinsRegular" }}
              >
                <Text style={{ fontFamily: "poppinsSemiBold" }}>
                  "Agreement"
                </Text>{" "}
                means this Data Protection Agreement.
              </Text>
              <Text
                className="text-[15px] text-gray-700 leading-6 mb-2"
                style={{ fontFamily: "poppinsRegular" }}
              >
                <Text style={{ fontFamily: "poppinsSemiBold" }}>
                  "Controller"
                </Text>{" "}
                means FranBoss Dammy Nigeria Limited
              </Text>
              <Text
                className="text-[15px] text-gray-700 leading-6 mb-2"
                style={{ fontFamily: "poppinsRegular" }}
              >
                <Text style={{ fontFamily: "poppinsSemiBold" }}>
                  "Processor"
                </Text>{" "}
                means any third-party processor appointed by and on behalf of
                the Controller.
              </Text>
              <Text
                className="text-[15px] text-gray-700 leading-6"
                style={{ fontFamily: "poppinsRegular" }}
              >
                <Text style={{ fontFamily: "poppinsSemiBold" }}>
                  "Personal Data"
                </Text>{" "}
                means any information relating to a Data Subject and containing
                an identifier such as a name, an identification number, location
                data, photo, email address, bank details, posts on social
                networking websites, medical information, and other unique
                identifier.
              </Text>
            </View>
          </View>
        </View>

        {/* Section 2: Purpose of Agreement */}
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
              Purpose of This Agreement
            </Text>
          </View>
          <Text
            className="text-[15px] text-gray-700 leading-6 ml-11"
            style={{ fontFamily: "poppinsRegular" }}
          >
            This Agreement outlines how personal data collected, stored,
            processed, and shared through the SharpLook App is protected and
            managed in compliance with the Nigeria Data Protection Act (NDPA)
            2023 and other applicable data privacy laws.
          </Text>
        </View>

        {/* Section 3: Types of Personal Data Collected */}
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
              Types of Personal Data Collected
            </Text>
          </View>
          <Text
            className="text-[15px] text-gray-700 leading-6 ml-11 mb-3"
            style={{ fontFamily: "poppinsRegular" }}
          >
            In the course of providing and facilitating services through our
            platform, we may collect and process the following categories of
            Personal Data:
          </Text>

          <View className="ml-11">
            <View className="rounded-xl p-4 mb-3 border border-[#eb278c35]">
              <Text
                className="text-[16px] text-gray-800 mb-2"
                style={{ fontFamily: "poppinsSemiBold" }}
              >
                Data Relating to Clients
              </Text>
              <Text
                className="text-[15px] text-gray-700 leading-6"
                style={{ fontFamily: "poppinsRegular" }}
              >
                Name, contact information, location data, service preferences,
                payment information, and communication history.
              </Text>
            </View>

            <View className="rounded-xl p-4 mb-3 border border-[#eb278c35]">
              <Text
                className="text-[16px] text-gray-800 mb-2"
                style={{ fontFamily: "poppinsSemiBold" }}
              >
                Data Relating to Service Providers
              </Text>
              <Text
                className="text-[15px] text-gray-700 leading-6"
                style={{ fontFamily: "poppinsRegular" }}
              >
                Professional credentials, business information, service
                offerings, availability schedules, and performance metrics.
              </Text>
            </View>

            <View className="rounded-xl p-4 mb-3 border border-[#eb278c35]">
              <Text
                className="text-[16px] text-gray-800 mb-2"
                style={{ fontFamily: "poppinsSemiBold" }}
              >
                Technical Data
              </Text>
              <Text
                className="text-[15px] text-gray-700 leading-6"
                style={{ fontFamily: "poppinsRegular" }}
              >
                Device information, IP addresses, usage patterns, and
                application performance data.
              </Text>
            </View>
          </View>
        </View>

        {/* Section 4: Data Processing Principles */}
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
              Data Processing Principles
            </Text>
          </View>

          <View className="ml-11">
            <View className="rounded-xl p-4 mb-3 border border-[#eb278c35]">
              <Text
                className="text-[16px] text-gray-800 mb-2"
                style={{ fontFamily: "poppinsSemiBold" }}
              >
                Lawfulness, Fairness, and Transparency
              </Text>
              <Text
                className="text-[15px] text-gray-700 leading-6"
                style={{ fontFamily: "poppinsRegular" }}
              >
                Personal data shall be processed lawfully, fairly, and in a
                transparent manner in relation to the data subject.
              </Text>
            </View>

            <View className="rounded-xl p-4 mb-3 border border-[#eb278c35]">
              <Text
                className="text-[16px] text-gray-800 mb-2"
                style={{ fontFamily: "poppinsSemiBold" }}
              >
                Purpose Limitation
              </Text>
              <Text
                className="text-[15px] text-gray-700 leading-6"
                style={{ fontFamily: "poppinsRegular" }}
              >
                Personal data shall be collected for specified, explicit, and
                legitimate purposes and not further processed in a manner that
                is incompatible with those purposes.
              </Text>
            </View>

            <View className="rounded-xl p-4 mb-3 border border-[#eb278c35]">
              <Text
                className="text-[16px] text-gray-800 mb-2"
                style={{ fontFamily: "poppinsSemiBold" }}
              >
                Data Minimization
              </Text>
              <Text
                className="text-[15px] text-gray-700 leading-6"
                style={{ fontFamily: "poppinsRegular" }}
              >
                Personal data shall be adequate, relevant, and limited to what
                is necessary in relation to the purposes for which they are
                processed.
              </Text>
            </View>

            <View className="rounded-xl p-4 mb-3 border border-[#eb278c35]">
              <Text
                className="text-[16px] text-gray-800 mb-2"
                style={{ fontFamily: "poppinsSemiBold" }}
              >
                Accuracy
              </Text>
              <Text
                className="text-[15px] text-gray-700 leading-6"
                style={{ fontFamily: "poppinsRegular" }}
              >
                Personal data shall be accurate and, where necessary, kept up to
                date; every reasonable step must be taken to ensure that
                personal data that are inaccurate are erased or rectified
                without delay.
              </Text>
            </View>

            <View className="rounded-xl p-4 mb-3 border border-[#eb278c35]">
              <Text
                className="text-[16px] text-gray-800 mb-2"
                style={{ fontFamily: "poppinsSemiBold" }}
              >
                Storage Limitation
              </Text>
              <Text
                className="text-[15px] text-gray-700 leading-6"
                style={{ fontFamily: "poppinsRegular" }}
              >
                Personal data shall be kept in a form which permits
                identification of data subjects for no longer than is necessary
                for the purposes for which the personal data are processed.
              </Text>
            </View>

            <View className="rounded-xl p-4 mb-3 border border-[#eb278c35]">
              <Text
                className="text-[16px] text-gray-800 mb-2"
                style={{ fontFamily: "poppinsSemiBold" }}
              >
                Integrity and Confidentiality
              </Text>
              <Text
                className="text-[15px] text-gray-700 leading-6"
                style={{ fontFamily: "poppinsRegular" }}
              >
                Personal data shall be processed in a manner that ensures
                appropriate security of the personal data, including protection
                against unauthorized or unlawful processing and against
                accidental loss, destruction, or damage.
              </Text>
            </View>
          </View>
        </View>

        {/* Section 5: Data Subject Rights */}
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
              Data Subject Rights
            </Text>
          </View>

          <View className="ml-11">
            <View className="rounded-xl p-4 mb-3 border border-[#eb278c35]">
              <Text
                className="text-[16px] text-gray-800 mb-2"
                style={{ fontFamily: "poppinsSemiBold" }}
              >
                Right to Access
              </Text>
              <Text
                className="text-[15px] text-gray-700 leading-6"
                style={{ fontFamily: "poppinsRegular" }}
              >
                You have the right to obtain confirmation of whether personal
                data concerning you is being processed and, where that is the
                case, access to the personal data.
              </Text>
            </View>

            <View className="rounded-xl p-4 mb-3 border border-[#eb278c35]">
              <Text
                className="text-[16px] text-gray-800 mb-2"
                style={{ fontFamily: "poppinsSemiBold" }}
              >
                Right to Rectification
              </Text>
              <Text
                className="text-[15px] text-gray-700 leading-6"
                style={{ fontFamily: "poppinsRegular" }}
              >
                You have the right to obtain the rectification of inaccurate
                personal data concerning you and to have incomplete personal
                data completed.
              </Text>
            </View>

            <View className="rounded-xl p-4 mb-3 border border-[#eb278c35]">
              <Text
                className="text-[16px] text-gray-800 mb-2"
                style={{ fontFamily: "poppinsSemiBold" }}
              >
                Right to Erasure
              </Text>
              <Text
                className="text-[15px] text-gray-700 leading-6"
                style={{ fontFamily: "poppinsRegular" }}
              >
                You have the right to obtain the erasure of personal data
                concerning you without undue delay where certain conditions are
                met.
              </Text>
            </View>

            <View className="rounded-xl p-4 mb-3 border border-[#eb278c35]">
              <Text
                className="text-[16px] text-gray-800 mb-2"
                style={{ fontFamily: "poppinsSemiBold" }}
              >
                Right to Data Portability
              </Text>
              <Text
                className="text-[15px] text-gray-700 leading-6"
                style={{ fontFamily: "poppinsRegular" }}
              >
                You have the right to receive the personal data concerning you
                in a structured, commonly used, and machine-readable format.
              </Text>
            </View>
          </View>
        </View>

        {/* Section 6: Security Measures */}
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
              Security Measures
            </Text>
          </View>
          <Text
            className="text-[15px] text-gray-700 leading-6 ml-11"
            style={{ fontFamily: "poppinsRegular" }}
          >
            We implement appropriate technical and organizational measures to
            ensure a level of security appropriate to the risk, including
            encryption, access controls, regular security assessments, and staff
            training on data protection.
          </Text>
        </View>

        {/* Section 7: Data Breach Notification */}
        <View className="mb-6">
          <View className="flex-row items-center mb-3">
            <View className="bg-primary w-8 h-8 rounded-full items-center justify-center mr-3">
              <Text
                className="text-white text-[14px]"
                style={{ fontFamily: "poppinsBold" }}
              >
                7
              </Text>
            </View>
            <Text
              className="text-[18px] text-gray-800"
              style={{ fontFamily: "poppinsBold" }}
            >
              Data Breach Notification
            </Text>
          </View>
          <Text
            className="text-[15px] text-gray-700 leading-6 ml-11"
            style={{ fontFamily: "poppinsRegular" }}
          >
            In the event of a personal data breach, we will notify the relevant
            supervisory authority and affected data subjects in accordance with
            the requirements of the Nigeria Data Protection Act 2023.
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
            For any questions regarding this Data Protection Agreement or to
            exercise your data subject rights, please contact us at:
          </Text>
          <TouchableOpacity
            onPress={handleEmailPress}
            className="flex-row items-center"
          >
            <Text
              className="text-primary text-[15px] underline"
              style={{ fontFamily: "poppinsMedium" }}
            >
              privacy@sharplook.ng
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
