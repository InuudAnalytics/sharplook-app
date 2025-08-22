import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HttpClient } from "../api/HttpClient";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Storage key for device token (independent of user auth)
const DEVICE_TOKEN_KEY = "@device_fcm_token";

// Try to import Firebase messaging, but handle gracefully if not available
let messaging = null;
try {
  messaging = require("@react-native-firebase/messaging").default;
} catch (error) {
  console.log("Firebase messaging not available:", error.message);
}

class NotificationService {
  constructor() {
    this.fcmToken = null;
    this.notificationListener = null;
    this.responseListener = null;
    this.navigationRef = null;
    this.userType = null; // 'CLIENT' or 'VENDOR'
    this.backgroundMessageUnsubscribe = null;
    this.tokenRefreshUnsubscribe = null;
    this.isInitialized = false;
    this.firebaseAvailable = !!messaging;
  }

  /**
   * Set navigation reference for handling notification navigation
   */
  setNavigationRef(navigationRef, userType) {
    this.navigationRef = navigationRef;
    this.userType = userType;
    console.log("Navigation ref set for user type:", userType);
  }

  /**
   * Navigate based on notification data
   */
  handleNotificationNavigation(data) {
    if (!this.navigationRef || !this.userType) {
      console.log(
        "No navigation ref or user type available for notification navigation"
      );
      return;
    }

    try {
      console.log(
        "Handling notification navigation for user type:",
        this.userType
      );
      // Navigate to notification list for both client and vendor
      if (this.userType === "CLIENT") {
        this.navigationRef.navigate("ClientApp", {
          screen: "Main",
          params: {
            screen: "NotificationStack",
          },
        });
      } else if (this.userType === "VENDOR") {
        this.navigationRef.navigate("VendorApp", {
          screen: "NotificationList",
        });
      }
    } catch (error) {
      console.error("Navigation error:", error);
    }
  }

  /**
   * Request notification permissions and register for push tokens
   */
  async registerForPushNotifications() {
    try {
      console.log("Starting push notification registration...");

      // Check if device supports notifications
      if (!Device.isDevice) {
        console.log("Not a physical device, skipping notification setup");
        return false;
      }

      // Set up Android notification channel
      if (Platform.OS === "android") {
        console.log("Setting up Android notification channels...");
        await Notifications.setNotificationChannelAsync("default", {
          name: "Default Notifications",
          description: "Default notification channel for app notifications",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#ffffff",
          sound: "default",
          enableVibrate: true,
          enableLights: true,
          lockscreenVisibility:
            Notifications.AndroidNotificationVisibility.PUBLIC,
        });

        await Notifications.setNotificationChannelAsync("high-priority", {
          name: "High Priority",
          description: "High priority notifications for important updates",
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 500, 250, 500],
          lightColor: "#ffffff",
          sound: "default",
          enableVibrate: true,
          enableLights: true,
          lockscreenVisibility:
            Notifications.AndroidNotificationVisibility.PUBLIC,
        });
      }

      // ✅ Request Expo notification permissions (iOS + Android 13+)
      console.log("Requesting Expo notification permissions...");
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      console.log("Expo notification permission status:", finalStatus);
      if (finalStatus !== "granted") {
        console.log("Expo notification permission denied");
        return false;
      }

      // ✅ Request FCM permission (Firebase) - only if available
      if (messaging) {
        console.log("Requesting FCM permissions...");
        try {
          const authStatus = await messaging().requestPermission();
          const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

          console.log(
            "FCM permission status:",
            authStatus,
            "Enabled:",
            enabled
          );
          if (!enabled) {
            console.log("FCM permission denied");
            return false;
          }

          // Get FCM token
          console.log("Getting FCM token...");
          const fcmToken = await messaging().getToken();
          if (!fcmToken) {
            console.log("Failed to get FCM token");
            return false;
          }

          console.log("FCM token obtained:", fcmToken.substring(0, 20) + "...");
          this.fcmToken = fcmToken;

          await this.storePushToken(this.fcmToken);
          await this.registerTokenWithBackend(this.fcmToken);

          this.setupNotificationListeners();
          this.setupTokenRefreshListener();
          this.setupBackgroundMessageHandler();

          console.log("Push notification registration completed successfully");
          return true;
        } catch (error) {
          console.error("Firebase messaging error:", error);
          // Fall back to local notifications only
          console.log("Falling back to local notifications only");
          return this.setupLocalNotificationsOnly();
        }
      } else {
        console.log(
          "Firebase messaging not available, using local notifications only"
        );
        return this.setupLocalNotificationsOnly();
      }
    } catch (error) {
      console.error("Error in registerForPushNotifications:", error);
      return false;
    }
  }

  /**
   * Setup local notifications only (fallback when Firebase is not available)
   */
  async setupLocalNotificationsOnly() {
    try {
      console.log("Setting up local notifications only...");

      // Set up basic notification listeners for local notifications
      this.setupLocalNotificationListeners();

      console.log("Local notifications setup completed");
      return true;
    } catch (error) {
      console.error("Error setting up local notifications:", error);
      return false;
    }
  }

  /**
   * Set up local notification listeners
   */
  setupLocalNotificationListeners() {
    console.log("Setting up local notification listeners...");

    // Listen for notification responses
    this.responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response received:", response);
        this.handleNotificationNavigation(
          response.notification.request.content.data || {}
        );
      });

    // Listen for notifications received while app is in foreground
    this.notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
      }
    );
  }

  /**
   * Store push token locally (independent of user auth state)
   */
  async storePushToken(token) {
    try {
      await AsyncStorage.setItem(DEVICE_TOKEN_KEY, token);
      console.log("Push token stored locally");
    } catch (error) {
      console.error("Error storing push token:", error);
    }
  }

  /**
   * Get stored push token (independent of user auth state)
   */
  async getStoredPushToken() {
    try {
      const token = await AsyncStorage.getItem(DEVICE_TOKEN_KEY);
      console.log(
        "Retrieved stored push token:",
        token ? "exists" : "not found"
      );
      return token;
    } catch (error) {
      console.error("Error getting stored push token:", error);
      return null;
    }
  }

  /**
   * Register token with your backend
   */
  async registerTokenWithBackend(token) {
    try {
      console.log("Registering token with backend...");
      const response = await HttpClient.put("/user/updateFcmToken", {
        fcmToken: token,
      });
      console.log("Token registered with backend successfully");
      return response;
    } catch (error) {
      console.error("Error registering token with backend:", error);
      throw error;
    }
  }

  /**
   * Set up notification listeners
   */
  setupNotificationListeners() {
    if (!messaging) {
      console.log("Firebase messaging not available, skipping FCM listeners");
      return;
    }

    console.log("Setting up notification listeners...");

    // Listen for foreground messages
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("Received foreground message:", remoteMessage);
      // Show local notification when app is in foreground
      await this.showLocalNotification(
        remoteMessage.notification?.title || "New Notification",
        remoteMessage.notification?.body || "",
        remoteMessage.data || {}
      );
    });

    // Listen for notification opened app (when app is in background)
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log("Notification opened app:", remoteMessage);
      this.handleNotificationNavigation(remoteMessage.data || {});
    });

    // Check whether an initial notification is available (when app was closed)
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log("Initial notification found:", remoteMessage);
          this.handleNotificationNavigation(remoteMessage.data || {});
        }
      });

    this.notificationListener = unsubscribe;
    console.log("Notification listeners set up successfully");
  }

  /**
   * Set up token refresh listener
   */
  setupTokenRefreshListener() {
    if (!messaging) {
      console.log(
        "Firebase messaging not available, skipping token refresh listener"
      );
      return;
    }

    console.log("Setting up token refresh listener...");
    this.tokenRefreshUnsubscribe = messaging().onTokenRefresh(
      async (fcmToken) => {
        console.log("FCM token refreshed");
        this.fcmToken = fcmToken;

        // Store new token
        await this.storePushToken(fcmToken);

        // Update backend with new token
        try {
          await this.registerTokenWithBackend(fcmToken);
        } catch (error) {
          console.error("Failed to update backend with new FCM token:", error);
        }
      }
    );
  }

  /**
   * Set up background message handler
   */
  setupBackgroundMessageHandler() {
    if (!messaging) {
      console.log(
        "Firebase messaging not available, skipping background message handler"
      );
      return;
    }

    console.log("Setting up background message handler...");
    // Note: setBackgroundMessageHandler doesn't return an unsubscribe function
    // It's a global handler that persists until the app is terminated
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Received background message:", remoteMessage);
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: remoteMessage.notification?.title || "New Notification",
            body: remoteMessage.notification?.body || "",
            data: remoteMessage.data || {},
          },
          trigger: null, // show immediately
        });
      } catch (error) {
        console.error("Error showing background notification:", error);
      }
    });

    // Mark that background handler is set up
    this.backgroundMessageUnsubscribe = true;
  }

  /**
   * Show local notification (for foreground messages)
   */
  async showLocalNotification(title, body, data = {}) {
    try {
      console.log("Showing local notification:", title, body);
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error("Error showing local notification:", error);
    }
  }

  /**
   * Send local notification (for testing)
   */
  async sendLocalNotification(title, body, data = {}) {
    try {
      console.log("Sending test notification:", title, body);
      await this.showLocalNotification(title, body, data);
    } catch (error) {
      console.error("Error sending local notification:", error);
    }
  }

  /**
   * Clear notification badge
   */
  async clearBadge() {
    try {
      await Notifications.setBadgeCountAsync(0);
      console.log("Badge cleared");
    } catch (error) {
      console.error("Error clearing badge:", error);
    }
  }

  /**
   * Get current notification permissions
   */
  async getNotificationPermissions() {
    try {
      if (messaging) {
        const authStatus = await messaging().requestPermission();
        const status =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED
            ? "granted"
            : "denied";
        console.log("Current notification permission status:", status);
        return { status };
      } else {
        const { status } = await Notifications.getPermissionsAsync();
        console.log("Current Expo notification permission status:", status);
        return { status };
      }
    } catch (error) {
      console.error("Error getting notification permissions:", error);
      return null;
    }
  }

  /**
   * Clean up listeners
   */
  cleanup() {
    console.log("Cleaning up notification listeners...");
    try {
      // Handle notificationListener - could be either a function or an object with remove method
      if (this.notificationListener) {
        if (typeof this.notificationListener === "function") {
          this.notificationListener();
        } else if (
          this.notificationListener &&
          typeof this.notificationListener.remove === "function"
        ) {
          this.notificationListener.remove();
        }
      }

      if (
        this.responseListener &&
        typeof this.responseListener.remove === "function"
      ) {
        this.responseListener.remove();
      }
      if (
        this.tokenRefreshUnsubscribe &&
        typeof this.tokenRefreshUnsubscribe === "function"
      ) {
        this.tokenRefreshUnsubscribe();
      }

      // Note: backgroundMessageUnsubscribe is not a function, it's just a flag
      // setBackgroundMessageHandler doesn't return an unsubscribe function
      // The background handler persists until app termination

      // Reset all listeners to null
      this.notificationListener = null;
      this.responseListener = null;
      this.tokenRefreshUnsubscribe = null;
      this.backgroundMessageUnsubscribe = null;
      this.isInitialized = false;

      console.log("Notification listeners cleaned up successfully");
    } catch (error) {
      console.error("Error during notification cleanup:", error);
    }
  }

  /**
   * Initialize notification service
   */
  async initialize() {
    if (this.isInitialized) {
      console.log("Notification service already initialized");
      return true;
    }

    try {
      console.log("Initializing notification service...");
      console.log("Firebase available:", this.firebaseAvailable);

      // Check if we already have a stored token
      const storedToken = await this.getStoredPushToken();

      if (storedToken && this.firebaseAvailable) {
        console.log("Using stored token for initialization");
        this.fcmToken = storedToken;

        // Set up listeners
        this.setupNotificationListeners();
        this.setupTokenRefreshListener();
        this.setupBackgroundMessageHandler();

        // Verify token is still valid and register with backend
        try {
          await this.registerTokenWithBackend(storedToken);
        } catch (error) {
          console.log("Stored token invalid, generating new one...");
          await this.registerForPushNotifications();
        }

        this.isInitialized = true;
        return true;
      } else {
        console.log(
          "No stored token found or Firebase not available, generating new one..."
        );
        // Set up listeners and generate new token
        if (this.firebaseAvailable) {
          this.setupBackgroundMessageHandler();
        }
        const success = await this.registerForPushNotifications();
        this.isInitialized = success;
        return success;
      }
    } catch (error) {
      console.error("Error initializing notification service:", error);
      return false;
    }
  }

  /**
   * Clear stored device token (useful for logout scenarios)
   */
  async clearStoredToken() {
    try {
      console.log("Clearing stored token...");
      await AsyncStorage.removeItem(DEVICE_TOKEN_KEY);
      if (messaging) {
        await messaging().deleteToken();
      }
      this.fcmToken = null;
      this.isInitialized = false;
    } catch (error) {
      console.error("Error clearing stored token:", error);
    }
  }

  /**
   * Get current push token
   */
  getCurrentToken() {
    return this.fcmToken;
  }

  /**
   * Check if Firebase is available
   */
  isFirebaseAvailable() {
    return this.firebaseAvailable;
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;
