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
import Shield from "../../../../assets/icon/shield.svg"
import Data from "../../../../assets/icon/database.svg"
import Mail from "../../../../assets/icon/mail.svg"

export default function PrivacyPolicyScreen() {
  const navigation = useNavigation();
  const handleEmailPress = () => {
    Linking.openURL("mailto:hello@sharplook.beauty");
  };
  return (
    <View className="flex-1 bg-white pb-[50px]">
      {/* Header */}
      <View className="pt-[40px] pb-4 px-4 flex-row items-center shadow-sm mb-5 justify-between bg-white">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Shield name="chevron-back" size={24} color="#201E1F" />
        </TouchableOpacity>
        <Text
          style={{ fontFamily: "latoBold" }}
          className="text-[16px] text-faintDark"
        >
          Privacy Policy
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
            Privacy Policy
          </Text>
          <Text
            className="text-[14px] text-gray-600 mb-4"
            style={{ fontFamily: "poppinsMedium" }}
          >
            Last updated: July 24, 2025
          </Text>
          <View className="flex-row items-center">
            <View className="bg-[#eb278c25] p-2 rounded-[20px] mr-3">
              <Shield name="shield-checkmark" size={20} color="#EB278D" />
            </View>
            <Text
              className="text-[14px] text-gray-700 flex-1"
              style={{ fontFamily: "poppinsRegular" }}
            >
              How we protect and handle your personal information
            </Text>
          </View>
        </View>

        {/* Introduction Section */}
        <View className="mb-6">
          <Text
            className="text-[16px] text-gray-800 leading-7 mb-4"
            style={{ fontFamily: "poppinsRegular" }}
          >
            Welcome to SharpLook, a mobile application developed by FranBoss
            Dammy Nigeria Limited ("we," "us," or "our") that seamlessly
            connects users with hairstylists, barbers, nail technicians,
            pedicurists and massage therapists based on their location. We are
            committed to protecting your privacy and ensuring the security of
            your personal data in compliance with the Nigeria Data Protection
            Act (2023) and other relevant laws and regulations.
          </Text>
          <Text
            className="text-[16px] text-gray-800 leading-7 mb-4"
            style={{ fontFamily: "poppinsRegular" }}
          >
            This Privacy Policy explains what personal data the SharpLook
            application collects, and what we do with it. Please take the time
            to read through it carefully. If you have any questions, please send
            them to us at{" "}
            <TouchableOpacity onPress={handleEmailPress}>
              <Text className="text-primary underline -mb-1">
                hello@sharplook.beauty
              </Text>
            </TouchableOpacity>
            .
          </Text>
        </View>

        {/* Company Information */}
        <View className="rounded-2xl p-4 mb-6 border border-[#eb278c35]">
          <View className="flex-row items-center mb-2">
            <View className="bg-[#eb278c25] p-2 rounded-[20px] mr-3">
              <Data name="business" size={18} color="#EB278D" />
            </View>
            <Text
              className="text-[16px] text-gray-800"
              style={{ fontFamily: "poppinsSemiBold" }}
            >
              Data Controller Information
            </Text>
          </View>
          <Text
            className="text-[15px] text-gray-700 leading-6"
            style={{ fontFamily: "poppinsRegular" }}
          >
            FranBoss Dammy Nigeria Limited, a company duly incorporated under
            the laws of Nigeria, acts as the data controller in respect of all
            Personal Data collected through its Mobile Application. The company
            is responsible for determining the purposes and means of processing
            such data and ensuring compliance with applicable data protection
            regulations, including the Nigeria Data Protection Act 2023.
          </Text>
        </View>

        {/* Section 1: Privacy Policy Overview */}
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
              Privacy Policy Overview
            </Text>
          </View>
          <Text
            className="text-[15px] text-gray-700 leading-6 ml-11"
            style={{ fontFamily: "poppinsRegular" }}
          >
            This privacy policy ("Policy") describes how SharpLook ("Mobile
            Application", "we", "us" or "our") collects, protects and uses the
            personally identifiable information ("Personal Information") you
            ("User", "you" or "your") may provide in the SharpLook mobile
            application and any of its products or services (collectively,
            "Mobile Application" or "Services").
          </Text>
        </View>

        {/* Section 2: Automatic Collection */}
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
              Automatic Collection of Information
            </Text>
          </View>
          <Text
            className="text-[15px] text-gray-700 leading-6 ml-11"
            style={{ fontFamily: "poppinsRegular" }}
          >
            When you open the Mobile Application, our servers automatically
            records information that your device sends. This data may include
            information such as your device's IP address and location, device
            name and version, operating system type and version, language
            preferences, information you search for in our Mobile Application,
            access times and dates, and other statistics.
          </Text>
        </View>

        {/* Section 3: Personal Information Collection */}
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
              Collection of Personal Information
            </Text>
          </View>

          <View className="ml-11">
            <Text
              className="text-[16px] text-gray-800 mb-2"
              style={{ fontFamily: "poppinsSemiBold" }}
            >
              Information We Collect
            </Text>
            <Text
              className="text-[15px] text-gray-700 leading-6 mb-3"
              style={{ fontFamily: "poppinsRegular" }}
            >
              You will be asked to provide certain Personal Information (for
              example, your name and e-mail address), that can be used to
              contact or identify you while using our Service. We receive and
              store any information you knowingly provide to us when you create
              an account, publish content, or fill any online forms in the
              Mobile Application.
            </Text>

            <View className="rounded-xl p-4 mb-3 border border-[#eb278c35]">
              <Text
                className="text-[16px] text-gray-800 mb-2"
                style={{ fontFamily: "poppinsSemiBold" }}
              >
                Personal Information
              </Text>
              <Text
                className="text-[15px] text-gray-700 leading-6 mb-2"
                style={{ fontFamily: "poppinsRegular" }}
              >
                When you register, we collect your name, email address, phone
                number and password for authentication purposes. Account details
                such as user name, unique user ID, password.
              </Text>

              <Text
                className="text-[16px] text-gray-800 mb-2"
                style={{ fontFamily: "poppinsSemiBold" }}
              >
                Payment Information
              </Text>
              <Text
                className="text-[15px] text-gray-700 leading-6"
                style={{ fontFamily: "poppinsRegular" }}
              >
                When booking services, you would be asked to provide your
                payment details through our third-party payment processors in
                order for your payment to be validated and processed. We do not
                store your payment details on our servers.
              </Text>
            </View>
          </View>
        </View>

        {/* Section 4: Cookies and Usage Data */}
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
              Cookies and Usage Data
            </Text>
          </View>
          <Text
            className="text-[15px] text-gray-700 leading-6 ml-11 mb-3"
            style={{ fontFamily: "poppinsRegular" }}
          >
            We use cookies and similar tracking technologies to track the
            activity on our Service and hold certain information. Cookies are
            files with small amount of data which may include an anonymous
            unique identifier.
          </Text>

          <View className="ml-11">
            <Text
              className="text-[16px] text-gray-800 mb-2"
              style={{ fontFamily: "poppinsSemiBold" }}
            >
              Types of Cookies We Use
            </Text>
            <View className="space-y-2">
              <View className="flex-row items-start">
                <View className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                <Text
                  className="text-[15px] text-gray-700 leading-6 flex-1"
                  style={{ fontFamily: "poppinsRegular" }}
                >
                  <Text style={{ fontFamily: "poppinsSemiBold" }}>
                    Session Cookies:
                  </Text>{" "}
                  We use Session Cookies to operate our Service.
                </Text>
              </View>
              <View className="flex-row items-start">
                <View className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                <Text
                  className="text-[15px] text-gray-700 leading-6 flex-1"
                  style={{ fontFamily: "poppinsRegular" }}
                >
                  <Text style={{ fontFamily: "poppinsSemiBold" }}>
                    Preference Cookies:
                  </Text>{" "}
                  We use Preference Cookies to remember your preferences and
                  various settings.
                </Text>
              </View>
              <View className="flex-row items-start">
                <View className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                <Text
                  className="text-[15px] text-gray-700 leading-6 flex-1"
                  style={{ fontFamily: "poppinsRegular" }}
                >
                  <Text style={{ fontFamily: "poppinsSemiBold" }}>
                    Analytical Cookies:
                  </Text>{" "}
                  We use analytical cookies to recognize and determine the
                  number of user visits to the application.
                </Text>
              </View>
              <View className="flex-row items-start">
                <View className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                <Text
                  className="text-[15px] text-gray-700 leading-6 flex-1"
                  style={{ fontFamily: "poppinsRegular" }}
                >
                  <Text style={{ fontFamily: "poppinsSemiBold" }}>
                    Security Cookies:
                  </Text>{" "}
                  We use security Cookies to enhance the safety of your online
                  sessions.
                </Text>
              </View>
              <View className="flex-row items-start">
                <View className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                <Text
                  className="text-[15px] text-gray-700 leading-6 flex-1"
                  style={{ fontFamily: "poppinsRegular" }}
                >
                  <Text style={{ fontFamily: "poppinsSemiBold" }}>
                    Targeting Cookies:
                  </Text>{" "}
                  We use targeting cookies to track your online behaviors and
                  deliver personalized services.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Section 5: How We Share Information */}
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
              How We Share Your Personal Information
            </Text>
          </View>

          <View className="ml-11">
            <Text
              className="text-[16px] text-gray-800 mb-2"
              style={{ fontFamily: "poppinsSemiBold" }}
            >
              Sharing With Service Professionals
            </Text>
            <Text
              className="text-[15px] text-gray-700 leading-6 mb-3"
              style={{ fontFamily: "poppinsRegular" }}
            >
              In order to ensure effective service delivery, we would share your
              name, contact details, geographical location(if consented) and
              appointment references with the relevant hairstylist, barber, and
              nail technician, pedicurist or massage therapist.
            </Text>

            <Text
              className="text-[16px] text-gray-800 mb-2"
              style={{ fontFamily: "poppinsSemiBold" }}
            >
              Third-Party Payment Processor
            </Text>
            <Text
              className="text-[15px] text-gray-700 leading-6 mb-3"
              style={{ fontFamily: "poppinsRegular" }}
            >
              Our payment processor may share transaction-related data to
              confirm payments or process refunds.
            </Text>

            <Text
              className="text-[16px] text-gray-800 mb-2"
              style={{ fontFamily: "poppinsSemiBold" }}
            >
              Service Providers
            </Text>
            <Text
              className="text-[15px] text-gray-700 leading-6"
              style={{ fontFamily: "poppinsRegular" }}
            >
              We engage third-party providers (e.g, cloud hosting, analytics or
              customer support services) located in the United States, who
              process data on our behalf under strict data protection agreements
              compliant with the Nigeria Data Protection Act 2023.
            </Text>
          </View>
        </View>

        {/* Section 6: Data Security */}
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
              Information Security
            </Text>
          </View>
          <Text
            className="text-[15px] text-gray-700 leading-6 ml-11"
            style={{ fontFamily: "poppinsRegular" }}
          >
            We secure information you provide on computer servers in a
            controlled, secure environment, protected from unauthorized access,
            use, or disclosure. We maintain reasonable administrative,
            technical, and physical safeguards in an effort to protect against
            unauthorized access, use, modification, and disclosure of Personal
            Information in its control and custody.
          </Text>
        </View>

        {/* Section 7: Data Breach */}
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
              Data Breach
            </Text>
          </View>
          <Text
            className="text-[15px] text-gray-700 leading-6 ml-11"
            style={{ fontFamily: "poppinsRegular" }}
          >
            In the event we become aware that the security of the Mobile
            Application has been compromised, or users Personal Information has
            been disclosed to unrelated third parties as a result of external
            activity, we reserve the right to take reasonably appropriate
            measures, including investigation and reporting, as well as
            notification to and cooperation with law enforcement authorities.
          </Text>
        </View>

        {/* Section 8: Changes and Amendments */}
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
              Changes and Amendments
            </Text>
          </View>
          <Text
            className="text-[15px] text-gray-700 leading-6 ml-11"
            style={{ fontFamily: "poppinsRegular" }}
          >
            We may update this Privacy Policy from time to time at our
            discretion. When changes are made, we will revise the updated date
            at the bottom of this page. We may also provide notice to you in
            other ways at our discretion, such as through contact information
            you have provided.
          </Text>
        </View>

        {/* Contact Information */}
        <View className="rounded-2xl p-6 mb-6 border border-[#eb278c35]">
          <View className="flex-row items-center mb-3">
            <View className="bg-primary p-2 rounded-[20px] mr-3">
              <Mail name="mail" size={20} color="#fff" />
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
            If you would like to contact us to understand more about this Policy
            or wish to contact us concerning any matter relating to individual
            rights and your Personal Information, you may do so via the Contact
            Form or send an email to:
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
