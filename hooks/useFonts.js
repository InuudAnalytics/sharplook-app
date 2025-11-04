import { useFonts } from "expo-font";
import { useEffect, useState } from "react";

export const useCustomFonts = () => {
  const [fontsLoaded, fontError] = useFonts({
    poppinsThin: require("../assets/fonts/Poppins-Thin.ttf"),
    poppinsLight: require("../assets/fonts/Poppins-Light.ttf"),
    poppinsExtraLight: require("../assets/fonts/Poppins-ExtraLight.ttf"),
    poppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    poppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
    poppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
    poppinsSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
    poppinsExtraBold: require("../assets/fonts/Poppins-ExtraBold.ttf"),
    latoRegular: require("../assets/fonts/Lato-Regular.ttf"),
    latoBold: require("../assets/fonts/Lato-Bold.ttf"),
  });

  const [timeoutReached, setTimeoutReached] = useState(false);

  // Add timeout to prevent infinite loading
  useEffect(() => {
    console.log("📝 Font loading started...");
    
    const timeout = setTimeout(() => {
      if (!fontsLoaded && !fontError) {
        console.warn("⚠️ Font loading timeout - proceeding with system fonts");
        setTimeoutReached(true);
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, [fontsLoaded, fontError]);

  // Log when fonts load or error
  useEffect(() => {
    if (fontsLoaded) {
      console.log("✅ Fonts loaded successfully");
    }
    if (fontError) {
      console.error("❌ Font loading error:", fontError);
    }
  }, [fontsLoaded, fontError]);

  // Return true if fonts loaded, error occurred, or timeout reached
  return fontsLoaded || fontError !== null || timeoutReached;
};