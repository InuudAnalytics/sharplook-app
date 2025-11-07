import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Clipboard,
  Linking,
  Share,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { useAuth } from "../../../context/AuthContext";
import { showToast } from "../../ToastComponent/Toast";
import { HttpClient } from "../../../api/HttpClient";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { EmptyData } from "../../reusuableComponents/EmptyData";
import { formatAmount } from "../../formatAmount";
import { formatDateTime } from "../../reusuableComponents/DateConverter";

import Copy from '../../../assets/icon/copy.svg'
import Card from '../../../assets/icon/card.svg'
import Vendor from '../../../assets/icon/users.svg'
import Left from '../../../assets/icon/left.svg'

export default function VendorReferAndEarnScreen() {
  const navigation = useNavigation();
  const [inputCode, setInputCode] = useState("");
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [referralTransactions, setReferralTransactions] = useState([]);
  const [analytics, setAnalytics] = useState({});

  const referralCode = user?.referralCode;
  const handleCopy = () => {
    Clipboard.setString(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const getReferralInfo = async () => {
    setIsLoading(true);
    try {
      const [referralAnalytics, referralHistory] = await Promise.all([
        HttpClient.get("/referrals/analytics"),
        HttpClient.get("/referrals/referralHistory"),
      ]);
      setReferralTransactions(referralHistory.data.data);
      setAnalytics(referralAnalytics.data.data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      getReferralInfo();
    }, [])
  );
  return (
    <View className="flex-1 bg-white">
      <StatusBar backgroundColor="#EB278D" barStyle="light-content" />
      <View className="pt-[40px] pb-4 px-4 flex-row items-center shadow-sm mb-5 justify-between bg-white">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Left name="chevron-back" size={24} color="#201E1F" />
        </TouchableOpacity>
        <Text
          style={{ fontFamily: "latoBold" }}
          className="text-[16px] text-faintDark"
        >
          Refer and Earn
        </Text>
        <View style={{ width: 26 }} />
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View style={styles.headerBox}>
          <Text
            style={{ fontFamily: "latoBold" }}
            className="text-[32px] text-center mb-2 text-primary"
          >
            Refer a Friend, Earn{"\n"}
            <Text>₦100 Each!</Text>
          </Text>
          <Text
            style={{ fontFamily: "poppinsRegular" }}
            className="text-[14px] text-center"
          >
            Invite your friends to join SharpLook as vendors. When they join and
            start earning, you both get ₦100 credit.
          </Text>
        </View>

        <View style={styles.card}>
          <Text
            style={{ fontFamily: "poppinsMedium" }}
            className="text-[16px] mb-2"
          >
            Your Referral Code
          </Text>
          <Text
            style={{ fontFamily: "poppinsRegular" }}
            className="text-[12px] text-faintDark2"
          >
            Share this code with your friends!
          </Text>
          <View style={styles.codeRow} className="border border-[#EBEBEA]">
            <Text style={styles.code}>{user?.referralCode}</Text>
            <TouchableOpacity onPress={handleCopy} style={styles.copyIcon}>
              <Copy
                name={copied ? "check" : "copy"}
                size={20}
                color="#EB278D"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
            <Copy name="content-copy" width={20} height={20} color="#fff" />
            <Text style={styles.copyBtnText}>Copy Code</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text
            style={{ fontFamily: "poppinsMedium" }}
            className="text-[16px] mb-2"
          >
            Your Reward Summary
          </Text>
          <Text
            style={{ fontFamily: "poppinsRegular" }}
            className="text-[12px] text-faintDark2"
          >
            Your earnings and referral progress.
          </Text>

          <View style={styles.summaryRow}>
            <Card name="wallet-outline" width={20} height={20} color="#EB278D" />
            <Text style={styles.summaryLabel}>Money made</Text>
            <Text style={styles.summaryValue}>
              {formatAmount(analytics?.totalEarned)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Vendor name="people-outline" width={20} height={20} color="#EB278D" />
            <Text style={styles.summaryLabel}>Vendors Who Joined</Text>
            <Text style={styles.summaryValue}>
              {formatAmount(analytics?.totalReferrals)}
            </Text>
          </View>
        </View>

        <View className="mb-10" style={styles.card}>
          <Text style={styles.sectionTitle}>Referral History</Text>
          {referralTransactions.length > 0 ? (
            referralTransactions.map((tx, idx) => (
              <View key={idx} style={styles.txRow}>
                <Feather
                  name={
                    tx.type === "credit" ? "arrow-up-right" : "arrow-down-left"
                  }
                  size={24}
                  color={tx.type === "credit" ? "#EB278D" : "#EF4444"}
                  style={{ marginRight: 8 }}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={styles.txDesc}
                  >{`${tx.referredUser.firstName} joined with your referral code`}</Text>
                  <Text style={styles.txDate}>
                    {formatDateTime(tx.createdAt)}
                  </Text>
                </View>
                <Text style={[styles.txAmount, { color: "#EB278D" }]}>
                  {" "}
                  {tx.amountEarned > 0 ? "+" : ""}₦{Math.abs(tx.amountEarned)}
                </Text>
              </View>
            ))
          ) : (
            <EmptyData msg="No Referral yet" />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    color: "#222",
    fontSize: 16,
    fontFamily: "poppinsMedium",
    flex: 1,
    textAlign: "center",
    marginLeft: -28,
  },
  headerBox: {
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#FFF6F0",
    borderRadius: 16,
    padding: 16,
  },
  headerTitle: {
    fontFamily: "poppinsBold",
    fontSize: 22,
    color: "#BF6A37",
    textAlign: "center",
    marginBottom: 4,
  },
  headerHighlight: {
    color: "#E57373",
    fontFamily: "poppinsBold",
    fontSize: 22,
  },
  headerDesc: {
    fontFamily: "poppinsRegular",
    fontSize: 13,
    color: "#3c2a1e",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: "poppinsMedium",
    fontSize: 14,
    marginBottom: 2,
  },
  sectionDesc: {
    fontFamily: "poppinsRegular",
    fontSize: 12,
    color: "#3c2a1e",
    marginBottom: 8,
  },
  codeRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  code: {
    fontFamily: "poppinsBold",
    fontSize: 16,
    color: "#3c2a1e",
    flex: 1,
  },
  copyIcon: {
    marginLeft: 8,
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EB278D",
    borderRadius: 8,
    paddingVertical: 14,
    justifyContent: "center",
    marginBottom: 8,
  },
  copyBtnText: {
    color: "#fff",
    fontFamily: "poppinsRegular",
    fontSize: 12,
    marginLeft: 6,
  },
  shareRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 4,
  },
  shareIcon: {
    marginHorizontal: 8,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  summaryLabel: {
    fontFamily: "poppinsMedium",
    fontSize: 14,
    marginBottom: 8,
    color: "#3c2a1e",
    marginLeft: 8,
    flex: 1,
  },
  summaryValue: {
    fontFamily: "latoBold",
    fontSize: 20,
    color: "#EB278D",
  },
  txRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  txDesc: {
    fontFamily: "poppinsSemiBold",
    fontSize: 12,
  },
  txDate: {
    fontFamily: "poppinsRegular",
    fontSize: 10,
    color: "#A89B8A",
  },
  txAmount: {
    fontFamily: "poppinsSemiBold",
    fontSize: 15,
    marginLeft: 8,
  },
  forNewUsers: {
    fontFamily: "poppinsSemiBold",
    fontSize: 14,
    color: "#3c2a1e",
    marginBottom: 4,
    marginLeft: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#EBEBEA",
    borderRadius: 8,
    padding: 10,
    fontFamily: "poppinsRegular",
    fontSize: 14,
    marginBottom: 10,
    backgroundColor: "#F7F7F7",
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pasteBtn: {
    borderWidth: 1,
    width: "48%",
    borderColor: "#EB278D",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 8,
  },
  pasteBtnText: {
    color: "#EB278D",
    marginTop: 2,
    textAlign: "center",
    fontFamily: "poppinsRegular",
    fontSize: 12,
  },
  applyBtn: {
    backgroundColor: "#EB278D",
    borderRadius: 8,
    width: "48%",
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  applyBtnText: {
    color: "#fff",
    marginTop: 2,
    textAlign: "center",
    fontFamily: "poppinsRegular",
    fontSize: 12,
  },
});
