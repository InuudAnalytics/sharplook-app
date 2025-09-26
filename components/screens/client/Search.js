import React, { useEffect } from "react";
import {
  TouchableOpacity,
  View,
  TextInput,
  SafeAreaView,
  Image,
  Text,
  ScrollView,
  Pressable,
} from "react-native";
import OpenMenuBtn from "../../../assets/icon/opennav.svg";
import OpenChatBtn from "../../../assets/icon/chat.svg";
import Logo from "../../../assets/img/logo/bglogo.svg";
import FilterBtn from "../../../assets/icon/filter.svg";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import HomeImg1 from "../../../assets/img/home1.svg";
import HomeImg2 from "../../../assets/img/home2.svg";
import HomeImg3 from "../../../assets/img/home3.svg";
import HomeImg4 from "../../../assets/img/home4.svg";
import { useChatNavigation } from "../../../hooks/useChatNavigation";

export default function Search({ navigation }) {
  const { navigateToChatList } = useChatNavigation();
  useEffect(() => {}, []);

  return (
    <SafeAreaView className="flex-1 bg-secondary">
      <View className="pt-[60px] pb-[10px] items-center justify-between flex-row bg-primary px-4">
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <OpenMenuBtn width={40} height={40} />
        </TouchableOpacity>
        <Logo width={80} height={80} />
        <TouchableOpacity onPress={() => navigateToChatList(navigation)}>
          <OpenChatBtn width={40} height={40} />
        </TouchableOpacity>
      </View>
      <View className="flex-row items-center px-4 mt-6">
        <View className="flex-row items-center flex-1 bg-secondary border border-[#F9BCDC] rounded-xl px-4 pt-3 pb-2 mr-3">
          <MaterialIcons name="search" size={24} color="#8c817a" />
          <TextInput
            className="ml-2 text-sm placeholder:text-faintDark2"
            placeholder="Search Shop or Vendorzz"
            cursorColor="#BF6A37"
            style={{ fontFamily: "poppinsRegular" }}
          />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Filter")}>
          <FilterBtn width={40} height={40} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Services List */}
      <ScrollView className="mt-8 px-4 space-y-4">
        {[
          {
            id: 1,
            title: "Swedish Massage by Ayo",
            image: HomeImg1,
          },
          {
            id: 2,
            title: "Matoty Facials",
            image: HomeImg2,
          },
          {
            id: 3,
            title: "Salt Body Scrub",
            image: HomeImg3,
          },
          {
            id: 4,
            title: "Hot Stone Therapy",
            image: HomeImg4,
          },
        ].map((service) => {
          return (
            <Pressable
              key={service.id}
              onPress={() =>
                navigation.navigate("VendorProfileScreen", {
                  vendorData: {
                    id: service.id,
                    vendorOnboarding: {
                      businessName: service.title,
                      serviceType: "IN_SHOP",
                      bio: "Professional beauty services",
                      profilePicture: null,
                    },
                    rating: 4.5,
                    vendorServices: [],
                    products: [],
                  },
                })
              }
              className="bg-[#FCDFEE] mb-6 rounded-2xl overflow-hidden shadow-md"
              style={{ elevation: 2 }}
            >
              <View style={{ height: 150, width: "100%" }}>
                <service.image width="100%" height={150} />
              </View>
              <View className="p-4">
                <Text
                  className="text-lg font-medium text-faintDark"
                  style={{ fontFamily: "poppinsRegular" }}
                >
                  {service.title}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

// const styles = StyleSheet.create({

// });
