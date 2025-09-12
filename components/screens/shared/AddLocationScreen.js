import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  calculateDistance,
  formatDistance,
  getCurrentLocation,
} from "../../../utils/locationUtils";
import { showToast } from "../../ToastComponent/Toast";
import { HttpClient } from "../../../api/HttpClient";
import { useAuth } from "../../../context/AuthContext";
import LoaderOverlay from "../../reusuableComponents/LoaderOverlay";
import {
  getTrackingStatus,
  requestTrackingPermission,
} from "react-native-tracking-transparency";

const { width, height } = Dimensions.get("window");

export default function ClientAddLocationScreen({ navigation }) {
  const webviewRef = useRef(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [distances, setDistances] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [visible, setVisible] = useState(false);
  const {
    lastAttemptedCredentials,
    clearLastAttemptedCredentials,
    setIsAuthenticated,
    login,
  } = useAuth();

  const sampleLocations = [
    { name: "Sagamu, Ogun State", lat: 6.8333, lng: 3.6333 },
    { name: "Abeokuta, Ogun State", lat: 7.1557, lng: 3.3451 },
    { name: "Lekki-Epe, Lagos State", lat: 6.5244, lng: 3.3792 },
  ];

  useEffect(() => {
    const getLocation = async () => {
      try {
        const location = await getCurrentLocation();
        setCurrentLocation(location);
        setSelectedLocation(location);
        if (webviewRef.current) {
          webviewRef.current.postMessage(JSON.stringify(location));
        }
      } catch (error) {
        if (error.response && error.response.data) {
          const errorMessage =
            error.response.data.message || "An unknown error occurred";
          showToast.error(errorMessage);
        }
      }
    };
    getLocation();
  }, []);

  // ✅ Request ATT on iOS
  useEffect(() => {
    const requestATT = async () => {
      if (Platform.OS === "ios") {
        try {
          const status = await getTrackingStatus();
          if (status === "not-determined") {
            const newStatus = await requestTrackingPermission();
            console.log("ATT permission status:", newStatus);
          } else {
            console.log("ATT already set:", status);
          }
        } catch (err) {
          console.warn("ATT error:", err);
        }
      }
    };

    requestATT();
  }, []);

  useEffect(() => {
    if (currentLocation) {
      const newDistances = {};
      sampleLocations.forEach((location) => {
        const distance = calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          location.lat,
          location.lng
        );
        newDistances[location.name] = distance;
      });
      setDistances(newDistances);
    }
  }, [currentLocation]);

  const updateServiceRadius = async (latitude, longitude, radiusKm = 10) => {
    try {
      const payload = { radiusKm, latitude, longitude };
      const response = await HttpClient.put("/user/location", payload);
      showToast.success(response.data.message);

      if (
        lastAttemptedCredentials &&
        lastAttemptedCredentials.email &&
        lastAttemptedCredentials.password
      ) {
        try {
          const loginResponse = await HttpClient.post("/auth/login", {
            email: lastAttemptedCredentials.email,
            password: lastAttemptedCredentials.password,
          });
          if (loginResponse.data.token) {
            await login(loginResponse.data.token, "CLIENT");
            setIsAuthenticated(true);
            clearLastAttemptedCredentials();
            navigation.replace("ClientApp");
            return;
          } else {
            showToast.error("Login failed. Try logging in again.");
            clearLastAttemptedCredentials();
            navigation.replace("Login");
            return;
          }
        } catch (loginError) {
          showToast.error("Login failed. Try logging in again.");
          clearLastAttemptedCredentials();
          navigation.replace("Login");
          return;
        }
      } else {
        navigation.replace("ClientApp");
      }
    } catch (error) {
      console.error("API error:", error);
      if (error.response && error.response.data) {
        const errorMessage =
          error.response.data.message || "An unknown error occurred";
        showToast.error(errorMessage);
      }
    }
  };

  const handleUseCurrentLocation = async () => {
    setIsLoading(true);
    try {
      const location = await getCurrentLocation();
      setCurrentLocation(location);
      setSelectedLocation(location);
      webviewRef.current.postMessage(JSON.stringify(location));
      await updateServiceRadius(location.latitude, location.longitude);
    } catch (error) {
      console.error("handleUseCurrentLocation error:", error);
      if (error.response && error.response.data) {
        const errorMessage =
          error.response.data.message || "An unknown error occurred";
        showToast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Location</Text>
        <TouchableOpacity>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          height: 600,
          marginVertical: 16,
          borderRadius: 12,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#E9E9E9",
        }}
      >
        <View style={{ flex: 1 }}>
          <WebView
            ref={webviewRef}
            originWhitelist={["*"]}
            source={{
              html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" />
            <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"></script>
            <style>
              html, body, #map { height: 100%; margin: 0; padding: 0; }
            </style>
          </head>
          <body>
            <div id="map"></div>
            <script>
              var map = L.map('map').setView([6.5244, 3.3792], 13);
              L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 19
              }).addTo(map);
              var marker = L.marker([6.5244, 3.3792]).addTo(map)
                .bindPopup('You are here')
                .openPopup();

              function getLocationName(lat, lng) {
                fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lng + '&zoom=18&addressdetails=1')
                  .then(response => response.ok ? response.json() : Promise.reject('Failed'))
                  .then(data => {
                    if (data.display_name) {
                      marker.bindPopup(data.display_name).openPopup();
                    } else {
                      marker.bindPopup('You are here').openPopup();
                    }
                  })
                  .catch(() => marker.bindPopup('You are here').openPopup());
              }

              function updateMap(data) {
                if (data.latitude && data.longitude) {
                  map.setView([data.latitude, data.longitude], 16);
                  marker.setLatLng([data.latitude, data.longitude]);
                  getLocationName(data.latitude, data.longitude);
                }
              }

              document.addEventListener('message', function(event) {
                try {
                  var data = JSON.parse(event.data);
                  updateMap(data);
                } catch (e) {}
              });

              window.addEventListener('message', function(event) {
                try {
                  var data = JSON.parse(event.data);
                  updateMap(data);
                } catch (e) {}
              });
            </script>
          </body>
        </html>
      `,
            }}
            style={{ flex: 1 }}
            javaScriptEnabled
            domStorageEnabled
          />
        </View>
      </View>

      <View style={styles.bottomSheet}>
        <ScrollView>
          <TouchableOpacity
            className="py-5"
            style={[
              styles.locationOption,
              selectedLocation && styles.selectedLocationOption,
            ]}
            onPress={handleUseCurrentLocation}
            disabled={isLoading}
          >
            <MaterialIcons name="my-location" size={22} color="#EB278D" />
            <Text style={styles.currentLocationText}>
              {isLoading ? "Updating..." : "Use my current location"}
            </Text>
            {isLoading && (
              <ActivityIndicator
                size="small"
                color="#EB278D"
                style={{ marginLeft: 10 }}
              />
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
      <LoaderOverlay visible={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#EB278D",
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: "#fff",
    fontFamily: "poppinsMedium",
    fontSize: 18,
  },
  skipText: {
    color: "#fff",
    fontFamily: "poppinsRegular",
    fontSize: 12,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
  },
  locationOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  currentLocationText: {
    color: "#EB278D",
    fontFamily: "poppinsMedium",
    fontSize: 17,
    marginLeft: 10,
  },
  selectedLocationOption: {
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    padding: 8,
  },
});
