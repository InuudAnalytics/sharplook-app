import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Eye from '../../../assets/icon/eye.svg'
import Eyeoff from '../../../assets/icon/eye-off.svg'

export const AuthInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  style,
  error,
  touched,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const isPassword = secureTextEntry;

  // Outlined border color
  const borderColor =
    error && touched ? "#FF0000" : isFocused ? "#EB278D" : "#F9BCDC";

  // Label style: always floating
  const labelStyle = {
    position: "absolute",
    left: 12,
    paddingHorizontal: 4,
    top: -10,
    fontFamily: "poppinsRegular",
    fontSize: 14,
    backgroundColor: "#FFFAFD",
    color: isFocused ? "#EB278D" : "#333333",
    zIndex: 2,
    alignSelf: "flex-start",
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) {
      onBlur(e);
    }
  };

  // Filter out key from props to avoid React warning
  const { key, ...rest } = props;

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.outlinedContainer,
          { borderColor: borderColor },
          isFocused && styles.outlinedContainerFocused,
        ]}
      >
        <Text style={labelStyle} numberOfLines={1}>
          {label}
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder || ""}
          placeholderTextColor="#999"
          value={value}
          cursorColor="#EB278D"
          onChangeText={onChangeText}
          secureTextEntry={isPassword && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.eyeIcon}
            accessibilityRole="button"
            testID="toggle-password-visibility"
          >
            {/* <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={50}
              color="#EB278D4D"
            /> */}
            {isPasswordVisible ? <Eye stroke='#eb278d'/> : <Eyeoff stroke='#eb278d'/>}
          </TouchableOpacity>
        )}
      </View>
      {error && touched && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: "100%",
  },
  outlinedContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    paddingHorizontal: 12,
    height: 52,
    width: "100%",
    position: "relative",
    marginTop: 12,
  },
  outlinedContainerFocused: {
    borderColor: "#EB278D",
    backgroundColor: "transparent",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    marginTop: 8,
    backgroundColor: "transparent",
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    color: "#FF0000",
    fontSize: 14,
    fontFamily: "poppinsRegular",
    marginTop: 4,
    marginLeft: 12,
  },
  // Example app styles
  appContainer: {
    flex: 1,
    backgroundColor: "#D4B5A0",
    paddingHorizontal: 24,
    paddingTop: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 40,
  },
  inputSpacing: {
    marginBottom: 20,
  },
});
