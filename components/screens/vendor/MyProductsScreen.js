import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import AuthButton from "../../reusuableComponents/buttons/AuthButton";
import { HttpClient } from "../../../api/HttpClient";
import EmptySVG from "../../../assets/img/empty.svg";
import { formatAmount } from "../../formatAmount";
import BottomModal from "../../reusuableComponents/BottomModal";
import { EmptyData } from "../../reusuableComponents/EmptyData";
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

export default function MyProductsScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const { showToast } = require("../../ToastComponent/Toast");

  useFocusEffect(
    useCallback(() => {
      const fetchProducts = async () => {
        setLoading(true);
        try {
          const res = await HttpClient.get("/products/getVendorProducts");
          setProducts(res.data.data);
        } catch (err) {
          setProducts([]);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }, [])
  );

  // Delete product handler
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      setLoading(true);
      await HttpClient.delete(`/products/delete/${productToDelete}`);
      showToast.success("Product deleted successfully");
      setShowModal(false);
      setProductToDelete(null);
      // Refresh products
      const res = await HttpClient.get("/products/getVendorProducts");
      setProducts(res.data.data);
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
            My Products
          </Text>
        </View>
      </View>
      <View className="px-6">
        <AuthButton
          
          title="Add New Product"
          onPress={() => navigation.navigate("AddProduct")}
        />
        {loading ? (
          <SkeletonLoader />
        ) : products.length === 0 ? (
          <View className="items-center justify-center py-8">
            <EmptyData msg="No products yet." />
          </View>
        ) : (
          <View className="flex-row flex-wrap mt-10 justify-between">
            {products
              .filter(
                (p) =>
                  p.approvalStatus === "APPROVED" ||
                  p.approvalStatus === "PENDING"
              )
              .map((p) => (
                <View
                  key={p.id}
                  className="bg-white relative rounded-[12px] w-[48%] mb-4 shadow border border-pinklight"
                >
                  <Image
                    source={{ uri: p.picture }}
                    className="w-full h-[110px] rounded-t-[12px] mb-2"
                    style={{ resizeMode: "cover" }}
                  />
                  {p.approvalStatus === "PENDING" && (
                    <View className="bg-[#ffffffe8] absolute top-2 right-2 py-[2px] px-3 rounded-[10px] z-10">
                      <Text
                        className="text-[#ff0000] mt-1 text-[10px]"
                        style={{ fontFamily: "poppinsMedium" }}
                      >
                        Not approved yet
                      </Text>
                    </View>
                  )}
                  <View className="p-3">
                    <Text
                      className="text-[14px]"
                      style={{ fontFamily: "poppinsRegular" }}
                    >
                      {p.productName}
                    </Text>
                    <View>
                      <View className="flex-row mt-1 items-center justify-between">
                        <View>
                          <Text
                            className="text-primary text-[16px]"
                            style={{ fontFamily: "latoBold" }}
                          >
                            {formatAmount(p.price)}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            setShowModal(true);
                            setProductToDelete(p.id);
                          }}
                        >
                          <AntDesign name="delete" size={14} color="#E53935" />
                        </TouchableOpacity>
                      </View>
                      <View className="flex-row mt-2 items-center justify-between">
                        <View>
                          <Text
                            className="text-[10px] mt-1 text-[#00000066] mb-1"
                            style={{ fontFamily: "latoBold" }}
                          >
                            {p.qtyAvailable} pieces remaining
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("EditProduct", { product: p })
                          }
                        >
                          <MaterialIcons
                            name="mode-edit"
                            size={16}
                            color="#eb278d"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
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
          setProductToDelete(null);
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
            <Text
              style={{ fontFamily: "poppinsMedium" }}
              className="text-center text-[15px] text-white"
            >
              Yes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="mt-2 rounded-[12px] mb-4 border h-[52px] flex flex-row items-center w-full border-[#ff0000] justify-center"
            onPress={() => {
              setShowModal(false);
              setProductToDelete(null);
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
