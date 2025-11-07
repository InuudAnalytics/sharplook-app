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
import File from "../../../../assets/icon/file.svg"
import Back from "../../../../assets/icon/back.svg"
import Email from "../../../../assets/icon/mail.svg"

export default function TermsOfUseScreen() {
  const navigation = useNavigation();
  const handleEmailPress = () => {
    Linking.openURL("mailto:hello@sharplook.beauty");
  };
  return (
    <View className="flex-1 bg-white pb-[50px]">
      {/* Header */}
      <View className="pt-[40px] pb-4 px-4 flex-row items-center shadow-sm mb-5 justify-between bg-white">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Back name="chevron-back" size={24} color="#201E1F" />
        </TouchableOpacity>
        <Text
          style={{ fontFamily: "latoBold" }}
          className="text-[16px] text-faintDark"
        >
          Terms of Use
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
            Terms of Use
          </Text>
          <Text
            className="text-[14px] text-gray-600 mb-4"
            style={{ fontFamily: "poppinsMedium" }}
          >
            Last updated: August 5th, 2025
          </Text>
          <View className="flex-row items-center">
            <View className="bg-[#eb278c25] p-2 rounded-[20px] mr-3">
              <File name="document-text" size={20} color="#EB278D" />
            </View>
            <Text
              className="text-[14px] text-gray-700 flex-1"
              style={{ fontFamily: "poppinsRegular" }}
            >
              Legal agreement governing your use of SharpLook services
            </Text>
          </View>
        </View>

        {/* Introduction Section */}
        <View className="mb-6">
          <Text
            className="text-[16px] text-gray-800 leading-7 mb-4"
            style={{ fontFamily: "poppinsRegular" }}
          >
            Welcome to SharpLook ("we," "our," or "us"). Please read these Terms
            of Use ("Terms") carefully before using our Mobile Application
            (Application) and any services offered through the Site. By
            accessing or using our Mobile Application, you agree to be bound by
            these Terms and our [Privacy Policy]. If you do not agree with these
            Terms, please do not use our Application.
          </Text>
        </View>

        {/* Section 1 */}
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
              Acceptance of Terms
            </Text>
          </View>
          <Text
            className="text-[15px] text-gray-700 leading-6 ml-11"
            style={{ fontFamily: "poppinsRegular" }}
          >
            By accessing and using our Mobile application, you accept and agree
            to be bound by these Terms and our Privacy Policy. If you do not
            agree to these Terms, please do not use our mobile application.
          </Text>
        </View>

        {/* Section 2 */}
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
              Changes to Terms
            </Text>
          </View>
          <Text
            className="text-[15px] text-gray-700 leading-6 ml-11"
            style={{ fontFamily: "poppinsRegular" }}
          >
            We reserve the right to modify or replace these Terms at any time.
            We will provide notice of changes by updating the "Last Updated"
            date above. Your continued use of the Site after any such changes
            constitutes your acceptance of the new Terms.
          </Text>
        </View>

        {/* Section 3 */}
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
              Eligibility
            </Text>
          </View>

          <View className="ml-11">
            <Text
              className="text-[16px] text-gray-800 mb-2"
              style={{ fontFamily: "poppinsSemiBold" }}
            >
              Vendor Eligibility Requirements
            </Text>
            <Text
              className="text-[15px] text-gray-700 leading-6 mb-3"
              style={{ fontFamily: "poppinsRegular" }}
            >
              <Text style={{ fontFamily: "poppinsSemiBold" }}>
                Minimum Age Requirement for Vendor Listing:
              </Text>{" "}
              To be eligible for listing on the application as a Vendor,
              individuals must be at least eighteen (18) years of age at the
              time of registration. By applying to be listed, Vendors confirm
              that they meet this age requirement. The Platform reserves the
              right to suspend or terminate any Vendor account found to be in
              violation of this eligibility condition.
            </Text>

            <Text
              className="text-[16px] text-gray-800 mb-2"
              style={{ fontFamily: "poppinsSemiBold" }}
            >
              User Access and Parental Guidance
            </Text>
            <Text
              className="text-[15px] text-gray-700 leading-6"
              style={{ fontFamily: "poppinsRegular" }}
            >
              <Text style={{ fontFamily: "poppinsSemiBold" }}>
                User Eligibility and Minor Supervision:
              </Text>{" "}
              The application is accessible to Users of all ages. However, where
              a User is a minor, access to and use of the application must be
              done under the supervision and guidance of a parent or legal
              guardian. The Platform shall not be held liable for any
              unauthorized use of the application by minors without appropriate
              supervision.
            </Text>
          </View>
        </View>

        {/* Section 4 */}
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
              Services Offered
            </Text>
          </View>
          <Text
            className="text-[15px] text-gray-700 leading-6 ml-11"
            style={{ fontFamily: "poppinsRegular" }}
          >
            Sharp look is a beauty-focused digital application designed to
            connect Users with a curated network of professional service
            providers, including hairstylists, barbers, nail technicians, and
            massage therapists. The application facilitates seamless discovery
            and booking of beauty and wellness services based on the User's
            location, promoting convenience, accessibility, and trusted
            connections within the beauty industry.
          </Text>
        </View>

        {/* Section 5 */}
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
              User Accounts
            </Text>
          </View>

          <View className="ml-11">
            <Text
              className="text-[16px] text-gray-800 mb-2"
              style={{ fontFamily: "poppinsSemiBold" }}
            >
              5.1 Registration
            </Text>
            <Text
              className="text-[15px] text-gray-700 leading-6 mb-3"
              style={{ fontFamily: "poppinsRegular" }}
            >
              To access certain features, you may need to create an account. You
              agree to provide accurate, current, and complete information
              during registration and to update such information to keep it
              accurate.
            </Text>

            <Text
              className="text-[16px] text-gray-800 mb-2"
              style={{ fontFamily: "poppinsSemiBold" }}
            >
              Entity Level Acceptance
            </Text>
            <Text
              className="text-[15px] text-gray-700 leading-6 mb-3"
              style={{ fontFamily: "poppinsRegular" }}
            >
              If you are using the account on behalf of an entity, you represent
              and warrant that you have the authority to bind that entity to
              these Terms and by accepting these Terms, you are doing so on
              behalf of that entity (and all references to "you" in these Terms
              shall refer to that entity).
            </Text>

            <Text
              className="text-[16px] text-gray-800 mb-2"
              style={{ fontFamily: "poppinsSemiBold" }}
            >
              Registration
            </Text>
            <Text
              className="text-[15px] text-gray-700 leading-6 mb-3"
              style={{ fontFamily: "poppinsRegular" }}
            >
              To access specific products on the mobile application, you may be
              required to submit certain details (including identification and
              contact information) either during the initial registration
              process or throughout your continued use of the application. All
              information provided to SharpLook must be accurate, current, and
              complete. You are responsible for promptly notifying SharpLook of
              any changes or updates to such information.
            </Text>

            <Text
              className="text-[16px] text-gray-800 mb-2"
              style={{ fontFamily: "poppinsSemiBold" }}
            >
              Account Security
            </Text>
            <Text
              className="text-[15px] text-gray-700 leading-6"
              style={{ fontFamily: "poppinsRegular" }}
            >
              You are solely responsible for maintaining the confidentiality of
              your account credentials, including your password. Any activity
              conducted under your account will be presumed to have been
              authorized by you. If you suspect or become aware of any
              unauthorized access or use of your account, you must notify us
              immediately.
            </Text>
          </View>
        </View>

        {/* Section 6 */}
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
              Location Tracking and Update Requirements
            </Text>
          </View>
          <Text
            className="text-[15px] text-gray-700 leading-6 ml-11 mb-3"
            style={{ fontFamily: "poppinsRegular" }}
          >
            To ensure safety, accurate service delivery, and effective
            monitoring across the Sharplook platform ("Platform"), the following
            obligations apply to all Vendors and Users:
          </Text>

          <View className="ml-11">
            <Text
              className="text-[16px] text-gray-800 mb-2"
              style={{ fontFamily: "poppinsSemiBold" }}
            >
              Vendor Location Services
            </Text>
            <Text
              className="text-[15px] text-gray-700 leading-6 mb-3"
              style={{ fontFamily: "poppinsRegular" }}
            >
              Vendors are required to keep real-time location services enabled
              while actively using the Platform. Location data is used to
              confirm service delivery, optimize vendor-to-client matching, and
              enhance personal safety during active appointments. Disabling
              location tracking may lead to temporary suspension of features
              including job acceptance, appointment confirmation, and earnings
              disbursement.
            </Text>

            <Text
              className="text-[16px] text-gray-800 mb-2"
              style={{ fontFamily: "poppinsSemiBold" }}
            >
              Exceptions for Off-Grid or Private Services
            </Text>
            <Text
              className="text-[15px] text-gray-700 leading-6 mb-3"
              style={{ fontFamily: "poppinsRegular" }}
            >
              If a service is scheduled in an area with limited or no network
              connectivity ("Off-Grid"), Vendors must pre-flag the appointment
              as an Off-Grid Service during booking. In such cases, the Vendor
              must manually confirm service commencement and completion within
              the Platform immediately upon regaining connectivity. Sharplook
              reserves the right to limit Off-Grid appointments for safety
              reasons and may subject such bookings to additional verification.
            </Text>

            <Text
              className="text-[16px] text-gray-800 mb-2"
              style={{ fontFamily: "poppinsSemiBold" }}
            >
              Service Completion & Payment Triggers
            </Text>
            <Text
              className="text-[15px] text-gray-700 leading-6"
              style={{ fontFamily: "poppinsRegular" }}
            >
              Service completion must be logged by the Vendor within the
              Platform to trigger payment processing. This ensures accurate
              billing and maintains service quality standards.
            </Text>
          </View>
        </View>

        {/* Continue with remaining sections... */}
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
              Booking and Appointment Policies
            </Text>
          </View>
          <Text
            className="text-[15px] text-gray-700 leading-6 ml-11"
            style={{ fontFamily: "poppinsRegular" }}
          >
            All bookings must be made through the Platform. Cancellation
            policies vary by service provider and are clearly stated during the
            booking process. Late cancellations may incur fees as determined by
            individual vendors.
          </Text>
        </View>

        <View className="mb-6">
          <View className="flex-row items-center mb-3">
            <View className="bg-primary w-8 h-8 rounded-full items-center justify-center mr-3">
              <Text
                className="text-white text-[14px]"
                style={{ fontFamily: "poppinsBold" }}
              >
                8
              </Text>
            </View>
            <Text
              className="text-[18px] text-gray-800"
              style={{ fontFamily: "poppinsBold" }}
            >
              Payment Terms
            </Text>
          </View>
          <Text
            className="text-[15px] text-gray-700 leading-6 ml-11"
            style={{ fontFamily: "poppinsRegular" }}
          >
            All payments are processed securely through our third-party payment
            processors. Service fees and platform charges are clearly displayed
            before booking confirmation.
          </Text>
        </View>

        {/* Contact Information */}
        <View className="rounded-2xl p-6 mb-6 border border-[#eb278c35]">
          <View className="flex-row items-center mb-3">
            <View className="bg-primary p-2 rounded-[20px] mr-3">
              <Email name="mail" size={20} color="#fff" />
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
            If you have any questions about these Terms of Use, please contact
            us at:
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
