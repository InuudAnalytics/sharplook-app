// NOTE: All API integrations are commented out. Submit actions are navigation-based only for demo/testing.
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AuthButton from "../../reusuableComponents/buttons/AuthButton";
import { Formik } from "formik";
import { emailVerificationSchema } from "../../../utils/validationSchemas";
import SuccessModal from "../../Modal/SuccessModal";
import { showToast } from "../../ToastComponent/Toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HttpClient } from "../../../api/HttpClient";
import { Feather } from "@expo/vector-icons";
import LoaderOverlay from "../../reusuableComponents/LoaderOverlay";

export default function EmailVerificationScreenSignup({ navigation, route }) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [verifying, setVerifying] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);
  const email = route?.params?.email || "raj****@gmail.com";

  // Handler for resending OTP
  const handleResend = async () => {
    setLoading(true);
    try {
      const res = await HttpClient.post("/auth/send-otp", {
        email: route?.params?.email,
      });
      showToast.success(res.data.message);
      setTimer(60); // Reset timer
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage =
          error.response.data.message || "An unknown error occurred";
        showToast.error(errorMessage);
      } else {
        showToast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (text, idx, setFieldValue) => {
    if (/^[0-9]?$/.test(text)) {
      const newCode = [...code];
      newCode[idx] = text;
      setCode(newCode);

      // Update Formik field value
      const verificationCode = newCode.join("");
      setFieldValue("otp", verificationCode);

      if (text && idx < 5) inputs.current[idx + 1].focus();
      if (!text && idx > 0) inputs.current[idx - 1].focus();

      // Auto-verify when all 6 digits are entered
      if (text && idx === 5) {
        const fullCode = newCode.join("");
        if (fullCode.length === 6) {
          Keyboard.dismiss();
          handleVerify({ otp: fullCode });
        }
      }
    }
  };

  const handleVerify = async (values) => {
    setVerifying(true);
    try {
      const res = await HttpClient.post("/auth/verify-otp", {
        email: route?.params?.email,
        otp: values.otp,
      });
      showToast.success(res.data.message);
      navigation.replace("Login");
    } catch (error) {
      // Clear OTP input on error
      setCode(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();

      if (error.response && error.response.data) {
        const errorMessage =
          error.response.data.message || "An unknown error occurred";
        showToast.error(errorMessage);
      } else {
        showToast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setVerifying(false);
    }
  };
  return (
    <View className="flex-1 bg-secondary px-5 py-[40px]">
      <View className="flex-row items-center mb-8 gap-8">
        <Pressable onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={24} color="black" />
        </Pressable>
        <Text style={{ fontFamily: "poppinsSemiBold" }}>Verification</Text>
      </View>
      <Text
        className="text-center mb-1 text-[16px]"
        style={{ fontFamily: "poppinsRegular" }}
      >
        We have sent verification code to your email
      </Text>
      <Text
        className="text-center mb-10 text-[16px] text-primary"
        style={{ fontFamily: "poppinsRegular" }}
      >
        {email}
      </Text>
      <Text
        className="text-center mb-4 text-[16px]"
        style={{ fontFamily: "poppinsRegular" }}
      >
        Please enter your verification code
      </Text>
      <Formik
        initialValues={{ otp: "" }}
        validationSchema={emailVerificationSchema}
        onSubmit={handleVerify}
      >
        {({ setFieldValue, errors, touched, handleSubmit }) => (
          <>
            <View className="flex-row justify-center mb-4 gap-4">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <TextInput
                  key={i}
                  ref={(el) => (inputs.current[i] = el)}
                  value={code[i]}
                  onChangeText={(text) => handleChange(text, i, setFieldValue)}
                  keyboardType="number-pad"
                  maxLength={1}
                  cursorColor="#eb278c"
                  className={`w-12 h-12 border-2 rounded-lg text-center text-lg ${code[i] ? "border-primary" : "border-[#eb278c1c]"}`}
                  style={{ fontFamily: "poppinsRegular" }}
                />
              ))}
            </View>
            {errors.otp && touched.otp && (
              <Text
                style={{
                  color: "#FF0000",
                  fontSize: 12,
                  fontFamily: "poppinsRegular",
                  textAlign: "center",
                  marginBottom: 16,
                }}
              >
                {errors.otp}
              </Text>
            )}
            {/* Timer or Resend Code */}
            {timer > 0 ? (
              <Text
                className="text-center text-[16px] mb-2"
                style={{ fontFamily: "poppinsRegular" }}
              >
                Resend code in{" "}
                <Text className="text-primary">
                  {`${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, "0")}`}
                </Text>
              </Text>
            ) : (
              <Pressable onPress={handleResend}>
                <Text
                  style={{ fontFamily: "latoBold" }}
                  className="text-primary text-[16px] underline text-center mb-2"
                >
                  Resend Code
                </Text>
              </Pressable>
            )}
            <TouchableOpacity
              className="flex-row gap-3 justify-center items-center mt-[50px] mb-8"
              onPress={async () => {
                const phone = route?.params?.phone;

                if (!phone) {
                  // No phone? Go to phone number entry screen
                  navigation.navigate("ClientVerifyPhoneNumber", {
                    email: route?.params?.email,
                  });
                  return;
                }
                // If phone exists, send OTP and navigate to VerifyWithPhoneOTP
                setLoading(true);
                try {
                  await HttpClient.post("/auth/send-otp", {
                    phone: phone,
                  });
                  navigation.navigate("VerifyWithPhoneOTP", {
                    phone: phone,
                    email: route?.params?.email,
                  });
                } catch (error) {
                  if (error.response && error.response.data) {
                    const errorMessage =
                      error.response.data.message ||
                      "An unknown error occurred";
                    showToast.error(errorMessage);
                  } else {
                    showToast.error(
                      "An unexpected error occurred. Please try again."
                    );
                  }
                } finally {
                  setLoading(false);
                }
              }}
            >
              <Feather name="phone" size={20} color="#EB278D" />
              <Text
                style={{ fontFamily: "poppinsRegular" }}
                className="text-primary text-[12px]"
              >
                Verify with Phone Number instead
              </Text>
            </TouchableOpacity>

            <View className="flex-1" />
            <View className="mb-8">
              <AuthButton
                title="Verify"
                disabled={verifying}
                loadingMsg="Verifying"
                onPress={() => {
                  handleSubmit();
                }}
                isloading={loading}
              />
            </View>
          </>
        )}
      </Formik>
      <LoaderOverlay visible={verifying} />
    </View>
  );
}
