import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { AuthInput } from "../../reusuableComponents/inputFields/AuthInput";
import { Formik } from "formik";
import Logo from "../../../assets/img/logo/sharplooklogo.svg";
import FBicon from "../../../assets/img/logo/fbicon.svg";
import Twittericon from "../../../assets/img/logo/twittericon.svg";
import Appleicon from "../../../assets/img/logo/appleicon.svg";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AuthButton from "../../reusuableComponents/buttons/AuthButton";
import { useStatusBar } from "../../../context/StatusBarContext";
import { loginSchema } from "../../../utils/validationSchemas";
import { HttpClient } from "../../../api/HttpClient";
import { showToast } from "../../ToastComponent/Toast";
import { useAuth } from "../../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import LoaderOverlay from "../../reusuableComponents/LoaderOverlay";
import { useNotifications } from "../../../hooks/useNotifications";
import Check from "../../../assets/icon/check.svg"
export default function LoginScreen({ navigation }) {
  const [rememberMe, setRememberMe] = useState(false);
  const { setLastAttemptedCredentials, login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { forceRegisterToken } = useNotifications();

  const handleLogin = async (values) => {
    setIsLoading(true);
    try {
      const response = await HttpClient.post("/auth/login", values);

      const statusCode = response.data.statusCode || response.status;
      const userRole = response.data.user && response.data.user.role;
      const token = response.data.token;

      if (statusCode === 200) {
        if (userRole === "CLIENT") {
          if (token) {
            await login(token, userRole);
            // Register notification token after successful login
            await forceRegisterToken();
          }
          showToast.success(response.data.message);
          navigation.replace("ClientApp");
        } else {
          showToast.error("Please Login with a Client account!");
        }
      }
    } catch (error) {
      if (error.response) {
        const message = error.response.data && error.response.data.message;
        if (message === "No Location") {
          const token = error.response.data.token;
          await AsyncStorage.setItem("token", token);
          setLastAttemptedCredentials({
            email: values.email,
            password: values.password,
          });
          // Register notification token
          await forceRegisterToken();
          showToast.info(message);
          navigation.navigate("ClientAddLocation");
        } else if (
          message ===
          "Email or Phone Number not verified. An OTP has been sent to your email."
        ) {
          showToast.info(message);
          navigation.navigate("EmailVerificationSignup", {
            email: values.email,
          });
        } else {
          showToast.error(
            message || error.message || "An unknown error occurred"
          );
        }
      } else {
        showToast.error(error.message || "An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      style={styles.container}
      className="flex-1 pt-[60px] bg-secondary w-full p-4"
    >
      <View className="items-center justify-center">
        <View className="items-center">
          <Logo width={120} height={120} />
          <Text
            style={{ fontFamily: "poppinsBold" }}
            className="text-center text-[20px] mt-2"
          >
            Welcome Back
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
        initialValues={{ email: "", password: "" }}
        validationSchema={loginSchema}
        validateOnChange={true}
        validateOnBlur={true}
        onSubmit={handleLogin}
      >
        {({
          handleChange,
          handleBlur,
          values,
          errors,
          touched,
          handleSubmit,
        }) => {
          return (
            <View className="mt-10">
              <AuthInput
                label="Enter E-mail Address"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                error={errors.email}
                touched={touched.email}
                keyboardType="email-address"
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
              <View className="flex-row items-center justify-between mt-4 mb-2">
                <View className="flex-row items-center">
                  <Pressable
                    className="w-5 h-5 border border-primary rounded mr-2 items-center justify-center"
                    onPress={() => setRememberMe(!rememberMe)}
                  >
                    {rememberMe && (
                      // <MaterialIcons name="check" size={16} color="#EB278D" />
                                  <Check width={20} height={28} stroke="#eb278d"/>

                    )}
                  </Pressable>
                  <Text
                    className="text-[14px]"
                    style={{ fontFamily: "poppinsRegular" }}
                  >
                    Remember Me
                  </Text>
                </View>
                <Pressable
                  onPress={() => navigation.navigate("ForgotPassword")}
                >
                  <Text
                    className="text-[14px] text-primary"
                    style={{ fontFamily: "poppinsRegular" }}
                  >
                    Forgot Password?
                  </Text>
                </Pressable>
              </View>
              <AuthButton
                title="Login"
                loadingMsg="Logging in"
                isloading={isLoading}
                onPress={handleSubmit}
              />
              {/* Social Login Section */}
              <View className="mt-8 w-full items-center">
                <View className="flex-row justify-center gap-1 items-center mt-2">
                  <Text
                    className="text-[16px] text-[#6B6B6B]"
                    style={{ fontFamily: "latoRegular" }}
                  >
                    Don't have an account?
                  </Text>
                  <Pressable onPress={() => navigation.navigate("Register")}>
                    <Text
                      className="text-[16px] text-primary"
                      style={{ fontFamily: "latoRegular" }}
                    >
                      Register
                    </Text>
                  </Pressable>
                </View>
                <View className="flex-row justify-center gap-1 items-center mt-5">
                  <Pressable onPress={() => navigation.navigate("VendorLogin")}>
                    <Text
                      className="text-[16px] text-primary"
                      style={{ fontFamily: "latoRegular" }}
                    >
                      Switch to Vendor Login
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        }}
      </Formik>
      {/* <LoaderOverlay visible={isLoading} /> */}
    </View>
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
