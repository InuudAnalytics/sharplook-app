import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Platform,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Feather, AntDesign } from "@expo/vector-icons";
import AuthButton from "../../../reusuableComponents/buttons/AuthButton";
import { AuthInput } from "../../../reusuableComponents/inputFields/AuthInput";
import { useStatusBar } from "../../../../context/StatusBarContext";
import { Formik } from "formik";
import { vendorBusinessInfoSchema } from "../../../../utils/validationSchemas";
import { showToast } from "../../../ToastComponent/Toast";
import { HttpClient } from "../../../../api/HttpClient";
import { useAuth } from "../../../../context/AuthContext";
import LoaderOverlay from "../../../reusuableComponents/LoaderOverlay";
import * as ImagePicker from "expo-image-picker";

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
        className="text-[14px] mb-1 text-gray-600"
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
              className="text-center text-xl mb-4"
              style={{ fontFamily: "poppinsMedium" }}
            >
              Select Time
            </Text>

            <View className="flex-row justify-center items-center mb-4">
              <View className="flex-1">
                <Text
                  className="text-center text-base mb-2"
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

              <Text className="text-3xl mx-4">:</Text>

              <View className="flex-1">
                <Text
                  className="text-center text-base mb-2"
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
                  className="text-white mt-1 text-[13px]"
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

export default function VendorBusinessInfoScreen({ navigation }) {
  const { setBarType } = useStatusBar();
  const { userId, setUser, setIsAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    setBarType("primary");
  }, []);

  const isDaySelected = useCallback(
    (day) => selectedDays.includes(day),
    [selectedDays]
  );

  const handleSubmitBus = async (values) => {
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

      const res = await HttpClient.put("/vendor/complete-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      showToast.success(res.data.message);

      navigation.navigate("AddLocation");
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
    }
  };
  return (
    <View className="pb-[60px]" style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#EB278D",
          paddingTop: 60,
          paddingBottom: 16,
          paddingHorizontal: 16,
        }}
      >
        <Text
          style={{ color: "#fff", fontFamily: "poppinsMedium", fontSize: 16 }}
        >
          Vendor's Information
        </Text>
      </View>

      {/* Content Area */}
      <View style={{ flex: 1 }}>
        <Formik
          initialValues={{
            businessName: "",
            bio: "",
            location: "",
            registerationNumber: "",
            portfolioImages: [],
            availability: {
              days: [],
              fromTime: "",
              toTime: "",
            },
          }}
          validationSchema={vendorBusinessInfoSchema}
          onSubmit={handleSubmitBus}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
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

            const pickImage = async () => {
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
              <ScrollView
                contentContainerStyle={{ padding: 20 }}
                showsVerticalScrollIndicator={false}
              >
                <Text
                  style={{
                    fontFamily: "poppinsMedium",
                    fontSize: 16,
                    marginBottom: 20,
                    marginTop: 10,
                  }}
                >
                  Please fill in the information below
                </Text>
                {/* Business Name */}
                <AuthInput
                  label="Business Name"
                  value={values.businessName}
                  onChangeText={handleChange("businessName")}
                  onBlur={handleBlur("businessName")}
                  error={errors.businessName}
                  touched={touched.businessName}
                />
                <AuthInput
                  label="Business Description"
                  value={values.bio}
                  onChangeText={handleChange("bio")}
                  onBlur={handleBlur("bio")}
                  error={errors.bio}
                  touched={touched.bio}
                />
                <AuthInput
                  label="Location"
                  value={values.location}
                  onChangeText={handleChange("location")}
                  onBlur={handleBlur("location")}
                  error={errors.location}
                  touched={touched.location}
                />
                <AuthInput
                  label="Business Registration Number (CAC)"
                  value={values.registerationNumber}
                  onChangeText={handleChange("registerationNumber")}
                  onBlur={handleBlur("registerationNumber")}
                />

                {/* Portfolio Images Section */}
                <View className="mb-4">
                  <Text
                    className="text-[14px] mb-1 text-gray-600"
                    style={{ fontFamily: "poppinsMedium" }}
                  >
                    Portfolio Images
                  </Text>
                  <TouchableOpacity
                    className={`border border-dashed rounded-lg py-3 px-4 flex-row items-center justify-center ${
                      values.portfolioImages.length >= 6
                        ? "border-gray-300 bg-gray-100"
                        : "border-[#F9BCDC] bg-white"
                    }`}
                    onPress={pickImage}
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
                        values.portfolioImages.length >= 6 ? "#999" : "black"
                      }
                    />
                  </TouchableOpacity>
                  <Text
                    style={{ fontFamily: "poppinsRegular" }}
                    className="text-[12px] text-[#00000080] mt-2 mb-2"
                  >
                    Acceptable document type is Jpeg only and it should not be
                    more than 2MB (Maximum of 6 images)
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
                            <AntDesign name="close" size={12} color="#E53935" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}
                </View>

                {/* Availability Section */}
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
                              className={`text-[14px] ${
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

                {/* Button at bottom */}
                <View style={{ paddingTop: 20, paddingBottom: 30 }}>
                  <AuthButton
                    loadingMsg="Submitting"
                    title="Continue"
                    onPress={handleSubmit}
                    isloading={loading}
                  />
                </View>
              </ScrollView>
            );
          }}
        </Formik>
      </View>
      <LoaderOverlay visible={loading} />
    </View>
  );
}
