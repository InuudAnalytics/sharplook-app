import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import AuthButton from "../../reusuableComponents/buttons/AuthButton";
import { HttpClient } from "../../../api/HttpClient";
import EmptySVG from "../../../assets/img/empty.svg";
import { formatAmount } from "../../formatAmount";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomModal from "../../reusuableComponents/BottomModal";
import { BarIndicator } from "react-native-indicators";
import { showToast } from "../../ToastComponent/Toast";

function SkeletonLoader() {
  return (
    <View className="flex-row flex-wrap mt-10 justify-between px-1">
      {[1, 2, 3, 4].map((i) => (
        <View
          key={i}
          style={{
            backgroundColor: "#f3f3f3",
            borderRadius: 12,
            width: "48%",
            marginBottom: 16,
            height: 180,
            padding: 8,
          }}
        >
          <View
            style={{
              width: "100%",
              height: 110,
              borderRadius: 12,
              backgroundColor: "#e0e0e0",
              marginBottom: 8,
            }}
          />
          <View
            style={{
              width: "70%",
              height: 14,
              borderRadius: 7,
              backgroundColor: "#e0e0e0",
              marginBottom: 6,
            }}
          />
          <View
            style={{
              width: "40%",
              height: 12,
              borderRadius: 6,
              backgroundColor: "#e0e0e0",
              marginBottom: 8,
            }}
          />
          <View
            style={{
              width: "60%",
              height: 12,
              borderRadius: 6,
              backgroundColor: "#e0e0e0",
            }}
          />
        </View>
      ))}
    </View>
  );
}

export default function MyServicesScreen({ navigation }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await HttpClient.get("/vendorServices/my-services");
      setServices(res.data?.data || []);
      const token = await AsyncStorage.getItem("token");
    } catch (err) {
      setServices([]);
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchServices();
    }, [])
  );

  // Move fetchServices outside so it can be reused

  const handleDeleteProduct = async () => {
    setDeleting(true);
    try {
      const res = await HttpClient.delete(
        `/vendorServices/delete/${serviceToDelete}`
      );
      showToast.success(res.data.message);
      await fetchServices(); // Refresh the list after successful delete
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
      setDeleting(false);
      setShowModal(false);
      setServiceToDelete(null);
    }
  };
  return (
    <ScrollView className="flex-1 bg-white">
      <View
        className="pt-[60px] mb-5 pb-[20px]"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          backgroundColor: "#fff",
        }}
      >
        <View>
          <Text
            className="text-center"
            style={{ fontSize: 14, fontFamily: "latoBold" }}
          >
            My Services
          </Text>
        </View>
      </View>
      <View className="px-6">
        <AuthButton
          title="Add New Service"
          onPress={() => navigation.navigate("AddServices")}
        />
        {loading ? (
          <SkeletonLoader />
        ) : services.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              minHeight: 300,
            }}
          >
            <EmptySVG width={120} height={120} />
            <Text
              className="text-[16px] text-gray-400 mt-2"
              style={{ fontFamily: "poppinsRegular" }}
            >
              No services found
            </Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap mt-10 justify-between">
            {services.map((s) => (
              <View
                key={s.id}
                className="bg-white rounded-[12px] w-[48%] mb-4 shadow border border-pinklight"
              >
                <Image
                  source={{ uri: s.serviceImage }}
                  className="w-full h-[110px] rounded-t-[12px] mb-2"
                  style={{ resizeMode: "cover" }}
                />
                <View className="p-3">
                  <Text
                    className="text-[14px]"
                    style={{ fontFamily: "poppinsRegular" }}
                  >
                    {s.serviceName}
                  </Text>
                  <View className="flex-row mt-1 items-center justify-between">
                    <Text
                      className="text-primary text-[16px]"
                      style={{ fontFamily: "latoBold" }}
                    >
                      {formatAmount(s.servicePrice)}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setShowModal(true);
                        setServiceToDelete(s.id);
                      }}
                    >
                      <AntDesign name="delete" size={14} color="#E53935" />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("EditService", { service: s })
                    }
                    className="bg-primary py-2 rounded-[8px] mt-3"
                  >
                    <Text
                      style={{ fontFamily: "poppinsRegular" }}
                      className="text-[13px] text-center text-white"
                    >
                      Edit
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
      <BottomModal
        isVisible={showModal}
        onClose={() => {
          setShowModal(false);
          setServiceToDelete(null);
        }}
        showCloseBtn={true}
      >
        <View className="mb-8 mt-2">
          <Text
            className="text-[18px] text-center text-fadedDark"
            style={{ fontFamily: "latoBold" }}
          >
            Are you sure you want to delete this Product?
          </Text>
        </View>
        <View className="space-y-4 pb-10 mt-2">
          <TouchableOpacity
            className="mt-2 rounded-[12px] mb-4 h-[52px] flex flex-row items-center w-full bg-[#ff0000] justify-center"
            onPress={handleDeleteProduct}
          >
            {deleting ? (
              <BarIndicator color="#fff" size={20} />
            ) : (
              <Text
                style={{ fontFamily: "poppinsMedium" }}
                className="text-center text-[15px] text-white"
              >
                Yes
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            className="mt-2 rounded-[12px] mb-4 border h-[52px] flex flex-row items-center w-full border-[#ff0000] justify-center"
            onPress={() => {
              setShowModal(false);
              setServiceToDelete(null);
            }}
          >
            <Text
              style={{ fontFamily: "poppinsMedium" }}
              className="text-center text-[15px] text-[#ff0000]"
            >
              No
            </Text>
          </TouchableOpacity>
        </View>
      </BottomModal>
    </ScrollView>
  );
}
