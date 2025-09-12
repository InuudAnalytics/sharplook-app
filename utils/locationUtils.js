import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
// Calculate distance between two coordinates using Haversine formula
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

// Format distance for display
export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m away from you`;
  } else {
    return `${Math.round(distance)}km away from you`;
  }
};

// Get current location with error handling
export const getCurrentLocation = async () => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Permission to access location was denied");
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error("Error getting location:", error);
    throw error;
  }
};

// Utility function to check if user location is set for home service booking
export const checkUserLocationForBooking = (user, showToast, navigation) => {
    // const navigation = useNavigation();

  if (!user || !user.location) {
    showToast.warning(
      "Please set your location in your profile to book home services"
    );
navigation.navigate('EditProfileScreen');

    
    return false;
  }
  return true;
};

// Utility function to check if user location is set for cart checkout
export const checkUserLocationForCheckout = (user, showToast) => {
  if (!user || !user.location) {
    showToast.warning(
      "Please set your location in your profile to checkout products"
    );
    return false;
  }
  return true;
};
