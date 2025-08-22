// NOTE: All API integrations are commented out. Submit actions are navigation-based only for demo/testing.
import React, { useState, useRef, useEffect } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AuthButton from "../../reusuableComponents/buttons/AuthButton";
import { Formik } from "formik";
import { emailVerificationSchema } from "../../../utils/validationSchemas";
import SuccessModal from "../../Modal/SuccessModal";

export default function EmailVerificationForgotPassword({ navigation, route }) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);
  const email = route?.params?.email || "raj****@gmail.com";

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
    }
  };
  const handleProceed = () => {
    setVisible(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };
  const handleVerify = async (values) => {
    // setLoading(true);
    // try {
    //   const res = await HttpClient.post("/auth/verify-otp", {
    //     email: route.params.email,
    //     otp: values.otp,
    //   });
    //   setVisible(true);
    //   await AsyncStorage.removeItem("token");
    // } catch (error) {
    //   if (error.response && error.response.data) {
    //     const errorMessage =
    //       error.response.data.message || "An unknown error occurred";
    //     showToast.error(errorMessage);
    //   }
    // } finally {
    //   setLoading(false);
    // }
    // Navigation only, no API integration

    navigation.replace("ResetPassword");
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
            <Text
              className="text-center text-[16px] mb-2"
              style={{ fontFamily: "poppinsRegular" }}
            >
              Resend code in{" "}
              <Text className="text-primary">
                {`${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, "0")}`}
              </Text>
            </Text>
            <View className="flex-1" />
            <View className="mb-8">
              <AuthButton
                title="Verify"
                disabled={loading}
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
      <SuccessModal
        onClose={handleProceed}
        visible={visible}
        message="Congratulations, you have successfully verified your email account"
        buttonText="Proceed to Login"
      />
    </View>
  );
}
