import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AuthButton from "../../../reusuableComponents/buttons/AuthButton";
import { Formik } from "formik";
import { emailVerificationSchema } from "../../../../utils/validationSchemas";
import { isAxiosError } from "axios";
import { showToast } from "../../../ToastComponent/Toast";
import { HttpClient } from "../../../../api/HttpClient";
import LoaderOverlay from "../../../reusuableComponents/LoaderOverlay";
import { Feather } from "@expo/vector-icons";

export default function VendorEmailVerificationScreen({ navigation, route }) {
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
    // Always include email in the payload
    const payload = { ...values, email };
    try {
      const res = await HttpClient.post("/auth/verify-otp", payload);
      showToast.success(res.data.message);
      navigation.navigate("VendorLogin");
    } catch (error) {
      // Clear OTP input on error
      setCode(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
      if (isAxiosError(error)) {
        if (error.response && error.response.data) {
          const errorMessage =
            error.response.data.message || "An unknown error occurred";
          showToast.error(errorMessage);
        } else {
          showToast.error("An unexpected error occurred. Please try again.");
        }
      }
    } finally {
      setVerifying(false);
    }
  };
  return (
    <View className="flex-1 bg-secondary px-5 py-[60px]">
      <View className="flex-row items-center mb-8 gap-8">
        <Pressable onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={24} color="black" />
        </Pressable>
        <Text style={{ fontFamily: "poppinsSemiBold" }}>Verification</Text>
      </View>
      <Text
        className="text-center mb-1 text-sm"
        style={{ fontFamily: "poppinsRegular" }}
      >
        We have sent verification code to your email
      </Text>
      <Text
        className="text-center mb-10 text-sm text-primary"
        style={{ fontFamily: "poppinsRegular" }}
      >
        {email}
      </Text>
      <Text
        className="text-center mb-4 text-sm"
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
                style={{ fontFamily: "poppinsRegular" }}
                className="text-center text-[16px] mb-4"
              >
                Resend code in{" "}
                <Text
                  style={{ fontFamily: "latoBold" }}
                  className="text-primary text-[18px]"
                >
                  {Math.floor(timer / 60)} :{" "}
                  {String(timer % 60).padStart(2, "0")}
                </Text>
              </Text>
            ) : loading ? (
              <View style={{ alignItems: "center", marginBottom: 16 }}>
                <ActivityIndicator size="small" color="#eb278c" />
              </View>
            ) : (
              <TouchableOpacity onPress={handleResend}>
                <Text
                  style={{ fontFamily: "latoBold" }}
                  className="text-primary text-[16px] underline text-center mb-4"
                >
                  Resend Code
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              className="flex-row gap-3 justify-center items-center mt-[50px] mb-8"
              onPress={async () => {
                const phone = route?.params?.phone;

                if (!phone) {
                  // No phone? Go to phone number entry screen
                  navigation.navigate("PhoneNumberVerificationScreen", {
                    email: route?.params?.email,
                  });
                  return;
                }
                setLoading(true);
                try {
                  await HttpClient.post("/auth/send-otp", {
                    phone: phone,
                  });
                  navigation.navigate("OTPVerification", {
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
                className="text-primary text-[14px]"
              >
                Verify with Phone Number instead
              </Text>
            </TouchableOpacity>
            <View className="flex-1" />
            <View className="mb-8">
              <AuthButton
                title="Verify"
                onPress={handleSubmit}
                isloading={verifying}
              />
            </View>
          </>
        )}
      </Formik>
      <LoaderOverlay visible={verifying} />
    </View>
  );
}
