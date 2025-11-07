import React, { useEffect, useState, useCallback } from "react";
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Pressable,
  FlatList,
  Modal,
  Keyboard,
} from "react-native";
import { Feather, Ionicons, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import { vendorBusinessInfoSchema } from "../../../utils/validationSchemas";
import { useAuth } from "../../../context/AuthContext";
import { HttpClient } from "../../../api/HttpClient";
import { showToast } from "../../ToastComponent/Toast";
import OutlineTextInput from "../../reusuableComponents/inputFields/OutlineTextInput";
import AuthButton from "../../reusuableComponents/buttons/AuthButton";
import Dropdown from "../../reusuableComponents/inputFields/Dropdown";
import * as ImagePicker from "expo-image-picker";
import { OutlinePhoneInput } from "../../reusuableComponents/inputFields/OutlinePhoneInput";

import Left from '../../../assets/icon/left.svg'
import Edit from '../../../assets/icon/edit.svg'
import Map from '../../../assets/icon/map-pin.svg'

// Time picker component
const TimePicker = ({ value, onValueChange, label, error, touched }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempTime, setTempTime] = useState(value || "00:00");

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const handleConfirm = () => {
    onValueChange(tempTime);
    setShowPicker(false);
  };

  const handleCancel = () => {
    setTempTime(value || "00:00");
    setShowPicker(false);
  };

  return (
    <View className="flex-1">
      <Text
        className="text-[12px] mb-1 text-gray-600"
        style={{ fontFamily: "poppinsMedium" }}
      >
        {label}
      </Text>
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        className={`border rounded-lg px-3 py-3 ${
          error && touched ? "border-red-500" : "border-[#F9BCDC]"
        }`}
      >
        <Text
          className={`text-[16px] ${value ? "text-black" : "text-gray-400"}`}
          style={{ fontFamily: "poppinsRegular" }}
        >
          {value || "00:00"}
        </Text>
      </TouchableOpacity>
      {error && touched && (
        <Text
          className="text-red-500 text-[12px] mt-1"
          style={{ fontFamily: "poppinsRegular" }}
        >
          {error}
        </Text>
      )}

      <Modal
        visible={showPicker}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View className="bg-white rounded-lg p-4 w-80">
            <Text
              className="text-center text-lg mb-4"
              style={{ fontFamily: "poppinsMedium" }}
            >
              Select Time
            </Text>

            <View className="flex-row justify-center items-center mb-4">
              <View className="flex-1">
                <Text
                  className="text-center text-sm mb-2"
                  style={{ fontFamily: "poppinsMedium" }}
                >
                  Hour
                </Text>
                <ScrollView
                  style={{ height: 120 }}
                  showsVerticalScrollIndicator={false}
                >
                  {hours.map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      onPress={() => {
                        const [currentHour, currentMinute] =
                          tempTime.split(":");
                        setTempTime(`${hour}:${currentMinute}`);
                      }}
                      className={`py-2 px-4 rounded ${
                        tempTime.split(":")[0] === hour ? "bg-[#F9BCDC]" : ""
                      }`}
                    >
                      <Text
                        className={`text-center ${
                          tempTime.split(":")[0] === hour
                            ? "text-[#ED2584]"
                            : "text-gray-600"
                        }`}
                        style={{ fontFamily: "poppinsRegular" }}
                      >
                        {hour}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <Text className="text-2xl mx-4">:</Text>

              <View className="flex-1">
                <Text
                  className="text-center text-sm mb-2"
                  style={{ fontFamily: "poppinsMedium" }}
                >
                  Minute
                </Text>
                <ScrollView
                  style={{ height: 120 }}
                  showsVerticalScrollIndicator={false}
                >
                  {minutes.map((minute) => (
                    <TouchableOpacity
                      key={minute}
                      onPress={() => {
                        const [currentHour, currentMinute] =
                          tempTime.split(":");
                        setTempTime(`${currentHour}:${minute}`);
                      }}
                      className={`py-2 px-4 rounded ${
                        tempTime.split(":")[1] === minute ? "bg-[#F9BCDC]" : ""
                      }`}
                    >
                      <Text
                        className={`text-center ${
                          tempTime.split(":")[1] === minute
                            ? "text-[#ED2584]"
                            : "text-gray-600"
                        }`}
                        style={{ fontFamily: "poppinsRegular" }}
                      >
                        {minute}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View className="flex-row justify-center gap-4">
              <TouchableOpacity
                onPress={handleCancel}
                className="px-4 py-2 rounded border border-gray-300"
              >
                <Text
                  className="text-gray-600 text-[13px] mt-1"
                  style={{ fontFamily: "poppinsRegular" }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirm}
                className="px-4 py-2 rounded bg-[#ED2584]"
              >
                <Text
                  className="text-white mt-1 text-[15px]"
                  style={{ fontFamily: "poppinsRegular" }}
                >
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const StoreManagementScreen = () => {
  const navigation = useNavigation();
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Initialize availability from existing user data
  useEffect(() => {
    if (user?.vendorAvailability) {
      const availability = user.vendorAvailability;
      if (availability.days) {
        setSelectedDays(availability.days);
      }
      if (availability.fromTime) {
        setFromTime(availability.fromTime);
      }
      if (availability.toTime) {
        setToTime(availability.toTime);
      }
    }
  }, [user]);

  const isDaySelected = useCallback(
    (day) => selectedDays.includes(day),
    [selectedDays]
  );

  const initialValues = {
    businessName: user?.vendorOnboarding?.businessName || "",
    bio:
      user?.vendorOnboarding?.businessDescription ||
      user?.vendorOnboarding?.bio ||
      "",
    businessEmail: user?.email || "",
    phoneNumber: user?.phone || "",
    location:
      user?.vendorOnboarding?.businessAddress ||
      user?.vendorOnboarding?.location ||
      "",
    registerationNumber:
      user?.vendorOnboarding?.businessRegNumber ||
      user?.vendorOnboarding?.registerationNumber ||
      "",
    portfolioImages: user?.vendorOnboarding?.portfolioImages || [],
    availability: {
      days: user?.vendorAvailability?.days || [],
      fromTime: user?.vendorAvailability?.fromTime || "",
      toTime: user?.vendorAvailability?.toTime || "",
    },
  };

  const handleUpdate = async (values, { setSubmitting, setFieldError }) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("businessName", values.businessName);
      formData.append("bio", values.bio);
      formData.append("location", values.location);
      formData.append("registerationNumber", values.registerationNumber);

      const availabilityData = {
        days: values.availability.days,
        fromTime: values.availability.fromTime,
        toTime: values.availability.toTime,
      };
      formData.append("availability", JSON.stringify(availabilityData));

      values.portfolioImages.forEach((imageUri, index) => {
        const filename = imageUri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename ?? "");
        const type = match ? `image/${match[1]}` : `image`;
        formData.append("portfolioImages", {
          uri: imageUri,
          name: filename,
          type,
        });
      });

      const res = await HttpClient.put("/vendor/profile/edit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      showToast.success(res.data.message || "Profile updated successfully");
      // Let the polling mechanism handle the state update
    } catch (error) {
      let errorMsg = "An error occurred. Please try again.";
      if (error.response && error.response.data) {
        errorMsg =
          error.response.data.message || JSON.stringify(error.response.data);
      } else if (error.message) {
        errorMsg = error.message;
      }
      showToast.error(errorMsg);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const pickImage = async () => {
    try {
      // Request permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showToast.error(
          "Sorry, we need camera roll permissions to make this work!"
        );
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      showToast.error("Error selecting image. Please try again.");
    }
  };

  const uploadImage = async (imageUri) => {
    setIsUploadingImage(true);
    try {
      // Create form data
      const formData = new FormData();
      formData.append("avatar", {
        uri: imageUri,
        type: "image/jpeg",
        name: "profile-image.jpg",
      });

      const response = await HttpClient.put("/user/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data) {
        showToast.success(response.data.message);
        // Let the polling mechanism handle the state update
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Error uploading image";
      showToast.error(message);
    } finally {
      setIsUploadingImage(false);
    }
  };
  // Get the current image source
  const getImageSource = () => {
    if (selectedImage) {
      return { uri: selectedImage };
    }
    if (user?.avatar) {
      return { uri: user.avatar };
    }
    return require("../../../assets/icon/avatar.png");
  };

  return (
    <SafeAreaView className="flex-1 bg-secondary">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {/* Header with logo, name, badge, address */}
        <View className="bg-primary rounded-b-[40px] items-center pt-[70px] pb-8">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute left-4 top-10"
          >
            <Left name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View>
            <Image
              source={getImageSource()}
              className="w-24 h-24 rounded-full mb-4 bg-white"
            />
            <TouchableOpacity
              className="absolute bottom-2 right-2 bg-white p-1 rounded-full border border-gray-200"
              onPress={pickImage}
              disabled={isUploadingImage}
            >
              {isUploadingImage ? (
                <View className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
              ) : (
                <Edit name="edit" size={18} color="#000" />
              )}
            </TouchableOpacity>
          </View>
          <Text
            className="text-white text-[18px] text-center"
            style={{ fontFamily: "poppinsMedium" }}
          >
            {user?.vendorOnboarding?.businessName}
          </Text>
          <View className="flex-row items-center mt-2">
            <View className="bg-white px-3 py-1 rounded-lg flex-row items-center mr-2">
              <View className="w-2 h-2 rounded-full bg-[#ED2584] mr-2" />
              <Text
                className="text-[12px] mt-1 text-[#ED2584]"
                style={{ fontFamily: "poppinsMedium" }}
              >
                {user?.vendorOnboarding?.serviceType === "HOME_SERVICE"
                  ? "Home Service"
                  : "In-shop"}
              </Text>
            </View>
          </View>
          <View className="flex-row mt-2  w-[70%] justify-center">
            <Map name="location-sharp" width={10} height={20} color="#fff" />
            <Text
              className="text-white text-center text-[14px] ml-1"
              style={{ fontFamily: "poppinsLight" }}
            >
              {user?.vendorOnboarding?.location}
            </Text>
          </View>
        </View>

        {/* Form Body */}
        <View style={{ flex: 1 }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingBottom: 120,
              flexGrow: 1,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            onScrollBeginDrag={() => {
              setTimeout(() => {
                Keyboard.dismiss();
              }, 100);
            }}
            automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
          >
            <Formik
              initialValues={initialValues}
              validationSchema={vendorBusinessInfoSchema}
              enableReinitialize
              onSubmit={handleUpdate}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isSubmitting,
                setFieldValue,
              }) => {
                const updateAvailabilityDays = (newDays) => {
                  setSelectedDays(newDays);
                  setFieldValue("availability.days", newDays);
                };

                const updateFromTime = (time) => {
                  setFromTime(time);
                  setFieldValue("availability.fromTime", time);
                };

                const updateToTime = (time) => {
                  setToTime(time);
                  setFieldValue("availability.toTime", time);
                };

                const toggleDay = (day) => {
                  let newDays;
                  if (selectedDays.includes(day)) {
                    newDays = selectedDays.filter((d) => d !== day);
                  } else {
                    newDays = [...selectedDays, day];
                  }
                  updateAvailabilityDays(newDays);
                };

                const pickPortfolioImage = async () => {
                  if (values.portfolioImages.length >= 6) {
                    showToast.error(
                      "Maximum 6 images allowed. Please remove some images first."
                    );
                    return;
                  }

                  let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    quality: 1,
                    allowsMultipleSelection: true,
                    selectionLimit: 6 - values.portfolioImages.length,
                  });

                  if (
                    !result.canceled &&
                    result.assets &&
                    result.assets.length > 0
                  ) {
                    const newImages = result.assets.map((asset) => asset.uri);
                    const totalImages =
                      values.portfolioImages.length + newImages.length;

                    let updatedImages;
                    if (totalImages > 6) {
                      showToast.error(
                        "Maximum 6 images allowed. Only the first images will be added."
                      );
                      const remainingSlots = 6 - values.portfolioImages.length;
                      updatedImages = [
                        ...values.portfolioImages,
                        ...newImages.slice(0, remainingSlots),
                      ];
                    } else {
                      updatedImages = [...values.portfolioImages, ...newImages];
                    }

                    setFieldValue("portfolioImages", updatedImages);
                  }
                };

                const removeImage = (index) => {
                  const updatedImages = values.portfolioImages.filter(
                    (_, i) => i !== index
                  );
                  setFieldValue("portfolioImages", updatedImages);
                };

                return (
                  <View className="flex-1 px-4 pt-10">
                    <OutlineTextInput
                      label="Business Name"
                      value={values.businessName}
                      onChangeText={handleChange("businessName")}
                      onBlur={handleBlur("businessName")}
                      placeholder="Heritage Spa and Beauty Services"
                      error={errors.businessName}
                      touched={touched.businessName}
                    />
                    <OutlineTextInput
                      label="Business Description"
                      value={values.bio}
                      onChangeText={handleChange("bio")}
                      onBlur={handleBlur("bio")}
                      placeholder="Type here"
                      error={errors.bio}
                      touched={touched.bio}
                    />
                    <OutlineTextInput
                      label="Business Email Address"
                      value={values.businessEmail}
                      onChangeText={handleChange("businessEmail")}
                      onBlur={handleBlur("businessEmail")}
                      placeholder="rajibalikis@gmail.com"
                      keyboardType="email-address"
                      error={errors.businessEmail}
                      touched={touched.businessEmail}
                      editable={false}
                    />
                    <OutlinePhoneInput
                      label="Phone Number"
                      value={values.phoneNumber}
                      onChangeText={handleChange("phoneNumber")}
                      onBlur={handleBlur("phoneNumber")}
                      placeholder="8065456789"
                      keyboardType="phone-pad"
                      error={errors.phoneNumber}
                      touched={touched.phoneNumber}
                      isPhoneInput={true}
                      defaultCountry="NG"
                    />

                    <OutlineTextInput
                      label="Business Address"
                      value={values.location}
                      onChangeText={handleChange("location")}
                      onBlur={handleBlur("location")}
                      placeholder="Lagos, Nigeria"
                      error={errors.location}
                      touched={touched.location}
                    />
                    <OutlineTextInput
                      label="Business Registration Number"
                      value={values.registerationNumber}
                      onChangeText={handleChange("registerationNumber")}
                      onBlur={handleBlur("registerationNumber")}
                      placeholder="Type here"
                    />

                    {/* Portfolio Images Section */}
                    <View className="mb-4">
                      <TouchableOpacity
                        className={`border border-dashed rounded-lg py-3 px-4 flex-row items-center justify-center ${
                          values.portfolioImages.length >= 6
                            ? "border-gray-300 bg-gray-100"
                            : "border-[#F9BCDC] bg-white"
                        }`}
                        onPress={pickPortfolioImage}
                        disabled={values.portfolioImages.length >= 6}
                      >
                        <Text
                          className={`text-[16px] ml-2 ${
                            values.portfolioImages.length >= 6
                              ? "text-gray-500"
                              : "text-black"
                          }`}
                          style={{ fontFamily: "poppinsRegular" }}
                        >
                          {values.portfolioImages.length >= 6
                            ? "Maximum images reached"
                            : "Upload past work pictures"}
                        </Text>
                        <Feather
                          name="plus"
                          size={16}
                          color={
                            values.portfolioImages.length >= 6
                              ? "#999"
                              : "black"
                          }
                        />
                      </TouchableOpacity>
                      <Text
                        style={{ fontFamily: "poppinsRegular" }}
                        className="text-[12px] text-[#00000080] mt-2 mb-2"
                      >
                        Acceptable document type is Jpeg only and it should not
                        be more than 2MB (Maximum of 6 images)
                      </Text>

                      {values.portfolioImages.length > 0 && (
                        <View className="flex-row flex-wrap mb-4">
                          {values.portfolioImages.map((imageUri, index) => (
                            <View
                              key={index}
                              className="relative mb-2 mr-2"
                              style={{ width: "30%" }}
                            >
                              <Image
                                source={{ uri: imageUri }}
                                style={{
                                  width: "100%",
                                  height: 100,
                                  borderRadius: 8,
                                }}
                                resizeMode="cover"
                              />
                              <TouchableOpacity
                                onPress={() => removeImage(index)}
                                style={{
                                  position: "absolute",
                                  top: 4,
                                  right: 4,
                                  backgroundColor: "rgba(255,255,255,0.9)",
                                  borderRadius: 12,
                                  padding: 4,
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <AntDesign
                                  name="close"
                                  size={12}
                                  color="#E53935"
                                />
                              </TouchableOpacity>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>

                    <View className="mb-6">
                      <View className="border-t border-x rounded-t-[8px] pt-4 pb-3 px-4 border-[#E9E9E9]">
                        <Text
                          className="text-[16px] mb-3"
                          style={{ fontFamily: "poppinsMedium" }}
                        >
                          Availability
                        </Text>
                      </View>

                      <View className="bg-white border rounded-b-[8px] border-[#E9E9E9] p-4">
                        <View className="mb-4">
                          <Text
                            className="text-[14px] mb-2 text-gray-600"
                            style={{ fontFamily: "poppinsMedium" }}
                          >
                            Select Working Days
                          </Text>
                          <View className="flex-row flex-wrap gap-2">
                            {daysOfWeek.map((day) => (
                              <TouchableOpacity
                                key={day}
                                onPress={() => toggleDay(day)}
                                className={`px-3 py-2 rounded-lg border ${
                                  isDaySelected(day)
                                    ? "bg-[#F9BCDC] border-[#ED2584]"
                                    : "bg-white border-gray-300"
                                }`}
                              >
                                <Text
                                  className={`text-[12px] ${
                                    isDaySelected(day)
                                      ? "text-[#ED2584]"
                                      : "text-gray-600"
                                  }`}
                                  style={{ fontFamily: "poppinsRegular" }}
                                >
                                  {day}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                          {errors.availability?.days &&
                            touched.availability?.days && (
                              <Text
                                className="text-red-500 text-[12px] mt-1"
                                style={{ fontFamily: "poppinsRegular" }}
                              >
                                {errors.availability.days}
                              </Text>
                            )}
                        </View>

                        <View className="flex-row gap-3">
                          <TimePicker
                            label="Opening Time"
                            value={fromTime}
                            onValueChange={updateFromTime}
                            error={errors.availability?.fromTime}
                            touched={touched.availability?.fromTime}
                          />
                          <TimePicker
                            label="Closing Time"
                            value={toTime}
                            onValueChange={updateToTime}
                            error={errors.availability?.toTime}
                            touched={touched.availability?.toTime}
                          />
                        </View>
                      </View>
                    </View>

                    {/* Submit button container with extra padding for keyboard */}
                    <View className="mb-8 mt-4">
                      <AuthButton
                        title="Save Changes"
                        isloading={loading || isSubmitting}
                        loadingMsg="Saving..."
                        onPress={handleSubmit}
                      />
                    </View>
                  </View>
                );
              }}
            </Formik>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default StoreManagementScreen;
