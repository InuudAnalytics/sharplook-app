// import React from "react";
// import {
//   View,
//   Text,
//   Image,
//   Pressable,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   StatusBar,
// } from "react-native";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import { Ionicons, MaterialIcons } from "@expo/vector-icons";
// import Vendor from "../../../../assets/img/blackman.jpg";
// import AuthButton from "../../../reusuableComponents/buttons/AuthButton";
// import OutlineButton from "../../../reusuableComponents/buttons/OutlineButton";
// import { HttpClient } from "../../../../api/HttpClient";
// import * as ImagePicker from "expo-image-picker";
// import { Feather, AntDesign } from "@expo/vector-icons";
// import { Formik } from "formik";
// import * as Yup from "yup";
// import BottomModal from "../../../reusuableComponents/BottomModal";
// import { useState } from "react";
// import { OutlineTextAreaInput } from "../../../reusuableComponents/inputFields/OutlineTextInput";
// import { HexConverter } from "../../../reusuableComponents/HexConverter";
// import {
//   DateConverter,
//   formatDateToDDMMYYYY,
// } from "../../../reusuableComponents/DateConverter";
// import { formatAmount } from "../../../formatAmount";
// import { showToast } from "../../../ToastComponent/Toast";
// import { useChatNavigation } from "../../../../hooks/useChatNavigation";

// export default function BookingDetailScreen() {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const [isloadingComplete, setIsloadingComplete] = useState(false);
//   const { booking } = route.params || {};
//   const bookingId = booking?.id;
//   const handleCompleteBooking = async () => {
//     setIsloadingComplete(true);
//     try {
//       const res = await HttpClient.patch("/bookings/complete/client", {
//         bookingId,
//       });
//       showToast.success(res.data.message);
//       navigation.goBack();
//     } catch (error) {
//     } finally {
//       setIsloadingComplete(false);
//     }
//   };

//   const [showDisputeModal, setShowDisputeModal] = React.useState(false);
//   const [isSubmittingDispute, setIsSubmittingDispute] = React.useState(false);

//   // Dispute form validation schema
//   const disputeSchema = Yup.object().shape({
//     reason: Yup.string().required("Please provide a reason for the dispute."),
//     referencePhoto: Yup.mixed()
//       .test("fileType", "Only JPEG images are allowed.", (value) => {
//         if (!value) return true;
//         return value.endsWith(".jpg") || value.endsWith(".jpeg");
//       })
//       .test("fileSize", "Image must be less than 5MB.", async (value) => {
//         if (!value) return true;
//         // We can't check file size reliably in RN, so skip or handle in backend
//         return true;
//       }),
//   });

//   const handleDisputeSubmit = async (values, { resetForm }) => {
//     setIsSubmittingDispute(true);
//     try {
//       const formData = new FormData();
//       formData.append("bookingId", booking?.id);

//       // Add reason
//       formData.append("reason", values.reason);

//       // Add image if provided
//       if (values.referencePhoto) {
//         // Extract filename from URI
//         const filename = values.referencePhoto.split("/").pop();
//         const match = /\.(\w+)$/.exec(filename);
//         const type = match ? `image/${match[1]}` : "image/jpeg";

//         formData.append("referencePhoto", {
//           uri: values.referencePhoto,
//           name: filename || "dispute_image.jpg",
//           type: type,
//         });
//       }
//       const res = await HttpClient.post("/disputes/raiseDispute", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       showToast.success(res.data.message);
//       // Optionally show a toast or feedback here
//       setShowDisputeModal(false);
//       navigation.goBack();
//       resetForm();
//     } catch (error) {
//       showToast.error(error.response.data.message);
//     } finally {
//       setIsSubmittingDispute(false);
//     }
//   };

//   const pickImage = async (setFieldValue) => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 1,
//     });
//     if (!result.canceled && result.assets && result.assets.length > 0) {
//       setFieldValue("referencePhoto", result.assets[0].uri);
//     }
//   };

//   const { navigateToChat, isConnecting } = useChatNavigation();

//   return (
//     <View className="flex-1 pb-[40px] bg-secondary">
//       {/* Header */}
//       <StatusBar backgroundColor="#EB278D" barStyle="light-content" />
//       <View
//         className="flex-row items-center justify-between px-4 pt-[60px] pb-4 bg-secondary"
//         style={{
//           shadowColor: "#000",
//           shadowOffset: {
//             width: 0,
//             height: 2,
//           },
//           shadowOpacity: 0.1,
//           shadowRadius: 3.84,
//           elevation: 5,
//         }}
//       >
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="chevron-back" size={24} color="#000" />
//         </TouchableOpacity>
//         <Text style={{ fontFamily: "poppinsMedium" }} className="text-[16px]">
//           Booking details
//         </Text>
//         <View className="relative">
//           <MaterialIcons name="shopping-cart" size={24} color="#fff" />
//         </View>
//       </View>
//       <ScrollView className="px-4" showsVerticalScrollIndicator={false}>
//         {/* Status */}
//         <View className="items-center mt-4 mb-2">
//           <Text
//             style={{ fontFamily: "poppinsSemiBold" }}
//             className="text-[20px]"
//           >
//             {booking?.status === "ACCEPTED" && booking?.dispute !== null
//               ? "Disputed"
//               : booking?.status === "PENDING"
//                 ? "Pending"
//                 : booking?.status === "COMPLETED"
//                   ? "Completed"
//                   : "Accepted"}
//           </Text>

//           <Text
//             style={{ fontFamily: "latoBold" }}
//             className="text-[16px] text-[#00000080] mt-1"
//           >
//             Booking ID:{" "}
//             <Text className="text-[#000]">{HexConverter(booking?.id)}</Text>
//           </Text>
//           <Text
//             style={{ fontFamily: "latoBold" }}
//             className="text-[12px] text-[#00000080] mt-2"
//           >
//             {formatDateToDDMMYYYY(booking?.date)}
//           </Text>
//         </View>
//         <View className="h-[1px] my-5 bg-[#FDE9F4]" />
//         {/* Team Green */}
//         <View className="mt-4 mb-2">
//           <Text
//             style={{ fontFamily: "poppinsMedium" }}
//             className="text-[16px] mb-1"
//           >
//             {booking?.vendor?.lastName} {booking?.vendor?.firstName}
//           </Text>
//           <Text
//             style={{ fontFamily: "poppinsRegular" }}
//             className="text-[12px] text-faintDark2"
//           >
//             {booking?.vendor?.vendorOnboarding?.location}
//           </Text>
//           <Text
//             style={{ fontFamily: "poppinsRegular" }}
//             className="text-[12px] mt-1 text-faintDark2"
//           >
//             {booking?.vendor?.phone}
//           </Text>
//         </View>
//         {/* Vendor */}
//         <View className="mt-3">
//           <Text
//             style={{ fontFamily: "poppinsMedium" }}
//             className="text-[16px] mb-1"
//           >
//             Vendor
//           </Text>
//           <View className="flex-row items-center mb-2">
//             <Image
//               source={
//                 booking?.vendor?.vendorOnboarding?.businessImage
//                   ? { uri: booking?.vendor?.vendorOnboarding?.businessImage }
//                   : require("../../../../assets/icon/avatar.png")
//               }
//               className="w-[44px] h-[44px] rounded-full mr-3"
//             />
//             <View className="flex-1">
//               <Text
//                 style={{ fontFamily: "poppinsMedium" }}
//                 className="text-[14px]"
//               >
//                 {booking?.vendor?.vendorOnboarding?.businessName}
//               </Text>
//             </View>
//             <TouchableOpacity
//               onPress={() =>
//                 navigateToChat(navigation, {
//                   vendorId: booking?.vendor?.id,
//                   receiverName: booking?.vendor?.vendorOnboarding?.businessName,
//                   vendorPhone: booking?.vendor?.phone,
//                   chat: {
//                     id: booking?.vendor?.id,
//                     name: booking?.vendor?.vendorOnboarding?.businessName,
//                     avatar: booking?.vendor?.vendorOnboarding?.profilePicture,
//                     vendorId: booking?.vendor?.id,
//                   },
//                 })
//               }
//             >
//               <MaterialIcons name="chat" size={20} color="#EB278D" />
//             </TouchableOpacity>
//           </View>
//         </View>
//         {/* Booking Description */}
//         <View className=" rounded-xl mt-6 pb-3 mb-4">
//           <Text
//             style={{ fontFamily: "poppinsMedium" }}
//             className="text-[16px] mb-1"
//           >
//             Booking Description
//           </Text>
//           <View className="flex-row items-center border border-[#FCDFEE] mt-4 p-4 rounded-[8px]">
//             <Image
//               source={{ uri: booking?.service?.serviceImage }}
//               className="w-[50px] h-[50px] rounded-lg mr-4"
//             />
//             <View className="flex-1">
//               <Text
//                 style={{ fontFamily: "latoRegular" }}
//                 className="text-[16px]"
//               >
//                 {booking?.serviceName || booking?.service?.serviceName}
//               </Text>
//               <Text
//                 style={{ fontFamily: "poppinsRegular" }}
//                 className="text-[10px] mt-3 text-faintDark2"
//               >
//                 {booking?.time} {DateConverter(booking?.date)}
//               </Text>
//             </View>
//             <Text
//               style={{ fontFamily: "latoBold" }}
//               className="text-primary text-[14px] "
//             >
//               {formatAmount(booking?.price)}
//             </Text>
//           </View>
//         </View>
//         {/* Static Map */}

//         {/* Action Buttons */}
//         {booking?.status === "ACCEPTED" && booking?.dispute === null && (
//           <>
//             <AuthButton
//               title="Booking Completed"
//               isloading={isloadingComplete}
//               onPress={handleCompleteBooking}
//             />
//             <OutlineButton
//               title="Dispute Booking"
//               onPress={() => setShowDisputeModal(true)}
//             />
//           </>
//         )}
//       </ScrollView>
//       {/* Dispute Modal (local, not shared) */}
//       <BottomModal
//         isVisible={showDisputeModal}
//         onClose={() => setShowDisputeModal(false)}
//         showCloseBtn
//         backgroundcolor="#fff"
//       >
//         <Formik
//           initialValues={{ reason: "", referencePhoto: null }}
//           validationSchema={disputeSchema}
//           onSubmit={handleDisputeSubmit}
//         >
//           {({
//             handleChange,
//             handleBlur,
//             handleSubmit,
//             values,
//             errors,
//             touched,
//             setFieldValue,
//             resetForm,
//           }) => (
//             <View className="w-full px-2">
//               <Text
//                 className="text-[16px] mt-2 mb-1"
//                 style={{ fontFamily: "latoBold" }}
//               >
//                 Dispute
//               </Text>
//               <Text
//                 className="text-[14px] text-[#888]  mb-4"
//                 style={{ fontFamily: "latoRegular" }}
//               >
//                 Why are you disputing the booking?
//               </Text>

//               <OutlineTextAreaInput
//                 value={values.reason}
//                 onChangeText={handleChange("reason")}
//                 placeholder="Type here"
//                 minHeight={80}
//               />

//               <TouchableOpacity
//                 className="border border-dashed border-[#EB278D] rounded-lg py-[10px] px-4 flex-row items-center mb-2 mt-2 w-full justify-center"
//                 onPress={() => pickImage(setFieldValue)}
//               >
//                 <Text
//                   className="text-[12px] text-center mr-2"
//                   style={{ fontFamily: "poppinsRegular" }}
//                 >
//                   Upload a picture evidence
//                 </Text>
//                 <Feather name="plus" size={16} color="#000" />
//               </TouchableOpacity>
//               {values.referencePhoto && (
//                 <View className="mb-2 items-center">
//                   <Image
//                     source={{ uri: values.referencePhoto }}
//                     style={{ width: 120, height: 120, borderRadius: 8 }}
//                   />
//                   <TouchableOpacity
//                     onPress={() => setFieldValue("referencePhoto", null)}
//                     style={{
//                       position: "absolute",
//                       top: 4,
//                       right: 4,
//                       backgroundColor: "#fff",
//                       borderRadius: 16,
//                       padding: 4,
//                     }}
//                   >
//                     <AntDesign name="delete" size={18} color="#E53935" />
//                   </TouchableOpacity>
//                 </View>
//               )}
//               <Text
//                 style={{ fontFamily: "poppinsRegular" }}
//                 className="text-[10px] text-[#888] mb-2"
//               >
//                 Acceptable document type is Jpeg only and it should not be more
//                 than 5MB
//               </Text>

//               <AuthButton
//                 title="Submit"
//                 onPress={handleSubmit}
//                 loadingMsg="Submitting"
//                 isloading={isSubmittingDispute}
//                 disabled={isSubmittingDispute}
//               />
//             </View>
//           )}
//         </Formik>
//       </BottomModal>
//     </View>
//   );
// }

import React from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Vendor from "../../../../assets/img/blackman.jpg";
import AuthButton from "../../../reusuableComponents/buttons/AuthButton";
import OutlineButton from "../../../reusuableComponents/buttons/OutlineButton";
import { HttpClient } from "../../../../api/HttpClient";
import * as ImagePicker from "expo-image-picker";
import { Feather, AntDesign } from "@expo/vector-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import BottomModal from "../../../reusuableComponents/BottomModal";
import { useState } from "react";
import { OutlineTextAreaInput } from "../../../reusuableComponents/inputFields/OutlineTextInput";
import { HexConverter } from "../../../reusuableComponents/HexConverter";
import {
  DateConverter,
  formatDateToDDMMYYYY,
} from "../../../reusuableComponents/DateConverter";
import { formatAmount } from "../../../formatAmount";
import { showToast } from "../../../ToastComponent/Toast";
import { useChatNavigation } from "../../../../hooks/useChatNavigation";
import { ChatConnectionLoader } from "../../../reusuableComponents/ChatConnectionLoader";
import Chat from "../"

export default function BookingDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const [isloadingComplete, setIsloadingComplete] = useState(false);
  const { booking } = route.params || {};
  const bookingId = booking?.id;

  const handleCompleteBooking = async () => {
    setIsloadingComplete(true);
    try {
      const res = await HttpClient.patch("/bookings/complete/client", {
        bookingId,
      });
      showToast.success(res.data.message);
      navigation.goBack();
    } catch (error) {
    } finally {
      setIsloadingComplete(false);
    }
  };

  const [showDisputeModal, setShowDisputeModal] = React.useState(false);
  const [isSubmittingDispute, setIsSubmittingDispute] = React.useState(false);

  // Dispute form validation schema
  const disputeSchema = Yup.object().shape({
    reason: Yup.string().required("Please provide a reason for the dispute."),
    referencePhoto: Yup.mixed()
      .test("fileType", "Only JPEG images are allowed.", (value) => {
        if (!value) return true;
        return value.endsWith(".jpg") || value.endsWith(".jpeg");
      })
      .test("fileSize", "Image must be less than 5MB.", async (value) => {
        if (!value) return true;
        // We can't check file size reliably in RN, so skip or handle in backend
        return true;
      }),
  });

  const handleDisputeSubmit = async (values, { resetForm }) => {
    setIsSubmittingDispute(true);
    try {
      const formData = new FormData();
      formData.append("bookingId", booking?.id);

      // Add reason
      formData.append("reason", values.reason);

      // Add image if provided
      if (values.referencePhoto) {
        // Extract filename from URI
        const filename = values.referencePhoto.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        formData.append("referencePhoto", {
          uri: values.referencePhoto,
          name: filename || "dispute_image.jpg",
          type: type,
        });
      }
      const res = await HttpClient.post("/disputes/raiseDispute", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      showToast.success(res.data.message);
      // Optionally show a toast or feedback here
      setShowDisputeModal(false);
      navigation.goBack();
      resetForm();
    } catch (error) {
      showToast.error(error.response.data.message);
    } finally {
      setIsSubmittingDispute(false);
    }
  };

  const pickImage = async (setFieldValue) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFieldValue("referencePhoto", result.assets[0].uri);
    }
  };

  const { navigateToChat, isConnecting } = useChatNavigation();

  // Optimized chat navigation with error handling
  const handleChatVendor = async () => {
    try {
      const vendorId = booking?.vendor?.id;
      const vendorName = booking?.vendor?.vendorOnboarding?.businessName;

      if (vendorId) {
        await navigateToChat(navigation, {
          vendorId: vendorId,
          receiverName: vendorName,
          vendorPhone: booking?.vendor?.phone,
          chat: {
            id: vendorId,
            name: vendorName,
            avatar: booking?.vendor?.vendorOnboarding?.profilePicture,
            vendorId: vendorId,
          },
        });
      }
    } catch (error) {
      showToast.error("Failed to open chat");
    }
  };

  return (
    <View className="flex-1 pb-[40px] bg-secondary">
      {/* Chat Connection Loader */}
      <ChatConnectionLoader visible={isConnecting} />

      {/* Header */}
      <StatusBar backgroundColor="#EB278D" barStyle="light-content" />
      <View
        className="flex-row items-center justify-between px-4 pt-[60px] pb-4 bg-secondary"
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={{ fontFamily: "poppinsMedium" }} className="text-[18px]">
          Booking details
        </Text>
        <View className="relative">
          <MaterialIcons name="shopping-cart" size={24} color="#fff" />
        </View>
      </View>
      <ScrollView className="px-4" showsVerticalScrollIndicator={false}>
        {/* Status */}
        <View className="items-center mt-4 mb-2">
          <Text
            style={{ fontFamily: "poppinsSemiBold" }}
            className="text-[20px]"
          >
            {booking?.status === "ACCEPTED" && booking?.dispute !== null
              ? "Disputed"
              : booking?.status === "PENDING"
                ? "Pending"
                : booking?.status === "COMPLETED"
                  ? "Completed"
                  : "Accepted"}
          </Text>

          <Text
            style={{ fontFamily: "latoBold" }}
            className="text-[18px] text-[#00000080] mt-1"
          >
            Booking ID:{" "}
            <Text className="text-[#000]">{HexConverter(booking?.id)}</Text>
          </Text>
          <Text
            style={{ fontFamily: "latoBold" }}
            className="text-[14px] text-[#00000080] mt-2"
          >
            {formatDateToDDMMYYYY(booking?.date)}
          </Text>
        </View>
        <View className="h-[1px] my-5 bg-[#FDE9F4]" />
        {/* Team Green */}
        <View className="mt-4 mb-2">
          <Text
            style={{ fontFamily: "poppinsMedium" }}
            className="text-[18px] mb-1"
          >
            {booking?.vendor?.lastName} {booking?.vendor?.firstName}
          </Text>
          <Text
            style={{ fontFamily: "poppinsRegular" }}
            className="text-[12px] text-faintDark2"
          >
            {booking?.vendor?.vendorOnboarding?.location}
          </Text>
          <Text
            style={{ fontFamily: "poppinsRegular" }}
            className="text-[12px] mt-1 text-faintDark2"
          >
            {booking?.vendor?.phone}
          </Text>
        </View>
        {/* Vendor */}
        <View className="mt-3">
          <Text
            style={{ fontFamily: "poppinsMedium" }}
            className="text-[16px] mb-1"
          >
            Vendor
          </Text>
          <View className="flex-row items-center mb-2">
            <Image
              source={
                booking?.vendor?.vendorOnboarding?.businessImage
                  ? { uri: booking?.vendor?.vendorOnboarding?.businessImage }
                  : require("../../../../assets/icon/avatar.png")
              }
              className="w-[44px] h-[44px] rounded-full mr-3"
            />
            <View className="flex-1">
              <Text
                style={{ fontFamily: "poppinsMedium" }}
                className="text-[14px]"
              >
                {booking?.vendor?.vendorOnboarding?.businessName}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleChatVendor}
              disabled={isConnecting}
              style={{
                opacity: isConnecting ? 0.7 : 1,
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              {isConnecting ? (
                <ActivityIndicator size="small" color="#EB278D" />
              ) : (
                <Chat name="chat" size={20} color="#EB278D" />
              )}
            </TouchableOpacity>
          </View>
        </View>
        {/* Booking Description */}
        <View className=" rounded-xl mt-6 pb-3 mb-4">
          <Text
            style={{ fontFamily: "poppinsMedium" }}
            className="text-[16px] mb-1"
          >
            Booking Description
          </Text>
          <View className="flex-row items-center border border-[#FCDFEE] mt-4 p-4 rounded-[8px]">
            <Image
              source={{ uri: booking?.service?.serviceImage }}
              className="w-[50px] h-[50px] rounded-lg mr-4"
            />
            <View className="flex-1">
              <Text
                style={{ fontFamily: "latoRegular" }}
                className="text-[16px]"
              >
                {booking?.serviceName || booking?.service?.serviceName}
              </Text>
              <Text
                style={{ fontFamily: "poppinsRegular" }}
                className="text-[10px] mt-3 text-faintDark2"
              >
                {booking?.time} {DateConverter(booking?.date)}
              </Text>
            </View>
            <Text
              style={{ fontFamily: "latoBold" }}
              className="text-primary text-[14px] "
            >
              {formatAmount(booking?.price)}
            </Text>
          </View>
        </View>
        {/* Static Map */}

        {/* Action Buttons */}
        {booking?.status === "ACCEPTED" && booking?.dispute === null && (
          <>
            <AuthButton
              title="Booking Completed"
              isloading={isloadingComplete}
              onPress={handleCompleteBooking}
            />
            <OutlineButton
              title="Dispute Booking"
              onPress={() => setShowDisputeModal(true)}
            />
          </>
        )}
      </ScrollView>
      {/* Dispute Modal (local, not shared) */}
      <BottomModal
        isVisible={showDisputeModal}
        onClose={() => setShowDisputeModal(false)}
        showCloseBtn
        backgroundcolor="#fff"
      >
        <Formik
          initialValues={{ reason: "", referencePhoto: null }}
          validationSchema={disputeSchema}
          onSubmit={handleDisputeSubmit}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
            resetForm,
          }) => (
            <View className="w-full px-2">
              <Text
                className="text-[16px] mt-2 mb-1"
                style={{ fontFamily: "latoBold" }}
              >
                Dispute
              </Text>
              <Text
                className="text-[14px] text-[#888]  mb-4"
                style={{ fontFamily: "latoRegular" }}
              >
                Why are you disputing the booking?
              </Text>

              <OutlineTextAreaInput
                value={values.reason}
                onChangeText={handleChange("reason")}
                placeholder="Type here"
                minHeight={80}
              />

              <TouchableOpacity
                className="border border-dashed border-[#EB278D] rounded-lg py-[10px] px-4 flex-row items-center mb-2 mt-2 w-full justify-center"
                onPress={() => pickImage(setFieldValue)}
              >
                <Text
                  className="text-[12px] text-center mr-2"
                  style={{ fontFamily: "poppinsRegular" }}
                >
                  Upload a picture evidence
                </Text>
                <Feather name="plus" size={16} color="#000" />
              </TouchableOpacity>
              {values.referencePhoto && (
                <View className="mb-2 items-center">
                  <Image
                    source={{ uri: values.referencePhoto }}
                    style={{ width: 120, height: 120, borderRadius: 8 }}
                  />
                  <TouchableOpacity
                    onPress={() => setFieldValue("referencePhoto", null)}
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      backgroundColor: "#fff",
                      borderRadius: 16,
                      padding: 4,
                    }}
                  >
                    <AntDesign name="delete" size={18} color="#E53935" />
                  </TouchableOpacity>
                </View>
              )}
              <Text
                style={{ fontFamily: "poppinsRegular" }}
                className="text-[10px] text-[#888] mb-2"
              >
                Acceptable document type is Jpeg only and it should not be more
                than 5MB
              </Text>

              <AuthButton
                title="Submit"
                onPress={handleSubmit}
                loadingMsg="Submitting"
                isloading={isSubmittingDispute}
                disabled={isSubmittingDispute}
              />
            </View>
          )}
        </Formik>
      </BottomModal>
    </View>
  );
}
