// NOTE: All API integrations are commented out. Submit actions are navigation-based only for demo/testing.
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { AuthInput } from "../../reusuableComponents/inputFields/AuthInput";
import { Formik } from "formik";
import Logo from "../../../assets/img/logo/sharplooklogo.svg";
import FBicon from "../../../assets/img/logo/fbicon.svg";
import Twittericon from "../../../assets/img/logo/twittericon.svg";
import Appleicon from "../../../assets/img/logo/appleicon.svg";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AuthButton from "../../reusuableComponents/buttons/AuthButton";
import { clientRegisterSchema } from "../../../utils/validationSchemas";
import { showToast } from "../../ToastComponent/Toast";
import { HttpClient } from "../../../api/HttpClient";
import { isAxiosError } from "axios";
// import LoaderOverlay from "../../reusuableComponents/LoaderOverlay";
import { PhoneInput } from "../../reusuableComponents/inputFields/PhoneInput";
import Check from "../../../assets/icon/check.svg"

export default function RegisterScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const handleSignup = async (values) => {
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = values;
      const res = await HttpClient.post("/auth/register", payload);

      showToast.success(res.data.message);
      if (res.data.statusCode === 201) {
      }
      navigation.navigate("EmailVerificationSignup", {
        email: values.email,
        phone: values.phone,
      });
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message;
        showToast.error(errorMessage);
      } else {
        showToast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={styles.container}
          className="flex-1 pt-[60px] bg-secondary w-full p-4"
        >
          <View className="items-center justify-center">
            <View className="items-center">
              <Logo width={112} height={112} />
              <Text
                style={{ fontFamily: "poppinsBold" }}
                className="text-center text-[20px] mt-2"
              >
                Create Your Account
              </Text>
              <Text
                style={{ fontFamily: "poppinsRegular" }}
                className="text-center text-[14px] text-faintDark"
              >
                Please fill the details below
              </Text>
            </View>
          </View>
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              phone: "",
              password: "",
              role: "CLIENT",
              acceptedPersonalData: false,
              referredByCode: "",
            }}
            validationSchema={clientRegisterSchema}
            onSubmit={handleSignup}
          >
            {({
              handleChange,
              handleBlur,
              values,
              errors,
              touched,
              handleSubmit,
              setFieldValue,
            }) => (
              <View className="mt-10 mb-[60px]">
                <View className="flex-row items-center justify-between gap-3">
                  <View className="flex-1">
                    <AuthInput
                      label="First Name"
                      value={values.firstName}
                      onChangeText={handleChange("firstName")}
                      onBlur={handleBlur("firstName")}
                      error={errors.firstName}
                      touched={touched.firstName}
                    />
                  </View>

                  <View className="flex-1">
                    <AuthInput
                      label="Last Name"
                      value={values.lastName}
                      onChangeText={handleChange("lastName")}
                      onBlur={handleBlur("lastName")}
                      error={errors.lastName}
                      touched={touched.lastName}
                    />
                  </View>
                </View>
                <AuthInput
                  label="Enter E-mail Address"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  error={errors.email}
                  touched={touched.email}
                  keyboardType="email-address"
                />

                <PhoneInput
                  label="Enter Phone Number"
                  placeholder="8123456789"
                  value={values.phone}
                  onChangeText={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                  error={errors.phone}
                  touched={touched.phone}
                  keyboardType="phone-pad"
                  isPhoneInput={true}
                />

                <AuthInput
                  label="Password"
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  error={errors.password}
                  touched={touched.password}
                  secureTextEntry
                />
                <AuthInput
                  label="Confirm Password"
                  value={values.confirmPassword}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  error={errors.confirmPassword}
                  touched={touched.confirmPassword}
                  secureTextEntry
                />
                <AuthInput
                  label="Referral Code (optional)"
                  value={values.referredByCode}
                  onChangeText={handleChange("referredByCode")}
                  onBlur={handleBlur("referredByCode")}
                  error={errors.referredByCode}
                  touched={touched.referredByCode}
                  secureTextEntry
                />
                <View className="flex-row items-start justify-between mt-4 mb-2">
                  <View className="flex-row items-start flex-1">
                    <Pressable
                      className="w-5 h-5 border border-primary rounded mr-2 items-center justify-center mt-0.5"
                      onPress={() =>
                        setFieldValue(
                          "acceptedPersonalData",
                          !values.acceptedPersonalData
                        )
                      }
                    >
                      {values.acceptedPersonalData && (
                        <Check width={13} height={28} stroke="#eb278d"/>
                      )}
                    </Pressable>
                    <View className="flex-1">
                      <Text
                        className="text-[13px]"
                        style={{ fontFamily: "poppinsRegular" }}
                      >
                        By signing up, you agree to our{" "}
                        <Text
                          className="text-[14px] text-primary underline"
                          style={{ fontFamily: "poppinsRegular" }}
                          onPress={() =>
                            navigation.navigate("AuthPrivacyPolicy")
                          }
                        >
                          Privacy Policy
                        </Text>{" "}
                        and{" "}
                        <Text
                          className="text-[14px] text-primary underline"
                          style={{ fontFamily: "poppinsRegular" }}
                          onPress={() => navigation.navigate("AuthTermsOfUse")}
                        >
                          Terms of Use
                        </Text>
                      </Text>
                    </View>
                  </View>
                </View>
                <AuthButton
                  title="Create Account"
                  loadingMsg="Creating"
                  isloading={loading}
                  onPress={handleSubmit}
                />
                {/* Social Login Section */}
                <View className="mt-8 w-full items-center">
                  <View className="flex-row justify-center gap-1 items-center mt-2">
                    <Text
                      className="text-[15px] text-[#6B6B6B]"
                      style={{ fontFamily: "latoRegular" }}
                    >
                      Already have an account?
                    </Text>
                    <Pressable onPress={() => navigation.navigate("Login")}>
                      <Text
                        className="text-[15px] text-primary"
                        style={{ fontFamily: "latoRegular" }}
                      >
                        Login
                      </Text>
                    </Pressable>
                  </View>
                  <View className="flex-row pb-10 justify-center gap-1 items-center mt-5">
                    <Pressable
                      onPress={() => navigation.navigate("VendorRegister")}
                    >
                      <Text
                        className="text-[15px] text-primary"
                        style={{ fontFamily: "latoRegular" }}
                      >
                        Switch to Vendor Signup
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
      {/* <LoaderOverlay visible={loading} /> */}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    maxWidth: 300,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  pickerContainer: {
    width: "100%",
    maxWidth: 300,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  picker: {
    height: 50,
    width: "100%",
  },
});
