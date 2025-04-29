import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import ModalWrapper from "@/components/ModalWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import { ScrollView } from "react-native";
import * as Icons from "phosphor-react-native";
import Typo from "@/components/Typo";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/authContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { createOrUpdateWallet, deleteWallet } from "@/services/walletService";
import { WalletType } from "@/types";
import { availableIcons, WalletIconName, walletIcons } from "@/constants/data";
import { useTranslation } from "react-i18next";

const WalletModal = () => {
  const { user, updateUserData } = useAuth();
  const [wallet, setWallet] = useState<WalletType>({
    name: "",
    icon: "Wallet",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const oldWallet: { name: string; icon: string; id: string } =
    useLocalSearchParams();
  console.log("old wallet: ", oldWallet);

  const { t } = useTranslation();

  useEffect(() => {
    if (oldWallet?.id) {
      setWallet({
        name: oldWallet?.name,
        icon: oldWallet?.icon,
      });
    }
  }, []);

  const onSubmit = async () => {
    let { name, icon } = wallet;
    if (!name.trim() || !icon) {
      Alert.alert("Wallet", t("alerts.fillFields"));
      return;
    }

    const data: WalletType = {
      name,
      icon,
      uid: user?.uid,
    };
    if (oldWallet?.id) data.id = oldWallet?.id;
    setLoading(true);
    const res = await createOrUpdateWallet(data);
    setLoading(false);
    console.log("result:", res);

    if (res.success) {
      router.back();
    } else {
      Alert.alert("Wallet", res.msg);
    }
  };

  const onDelete = async () => {
    // console.log("deleting wallet: ", oldWallet?.id);
    if (!oldWallet?.id) return;
    setLoading(true);
    const res = await deleteWallet(oldWallet?.id);
    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Wallet", res.msg);
    }
  };
  const showDeleteAlert = () => {
    Alert.alert(t("common.confirm"), t("wallet.deleteConfirm"), [
      {
        text: t("common.cancel"),
        onPress: () => console.log("cancel delete"),
        style: "cancel",
      },
      {
        text: t("common.delete"),
        onPress: () => onDelete(),
        style: "destructive",
      },
    ]);
  };

  const renderIcon = (iconName: WalletIconName) => {
    const IconComponent = walletIcons[iconName];
    return IconComponent ? (
      <IconComponent
        size={verticalScale(24)}
        color={wallet.icon === iconName ? colors.primary : colors.neutral400}
        weight={wallet.icon === iconName ? "fill" : "regular"}
      />
    ) : null;
  };
  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={oldWallet?.id ? t("wallet.update") : t("wallet.new")}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        {/* form */}
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>{t("common.walletName")}</Typo>
            <Input
              placeholder="Salary"
              value={wallet.name}
              onChangeText={(value) => setWallet({ ...wallet, name: value })}
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>{t("common.walletIcon")}</Typo>
            {/* icon grid */}
            <View style={styles.iconGrid}>
              {availableIcons.map((iconName) => (
                <TouchableOpacity
                  key={iconName}
                  style={[
                    styles.iconButton,
                    wallet.icon === iconName && {
                      backgroundColor: colors.primary + "20",
                      borderWidth: 1,
                      borderColor: colors.primary,
                    },
                  ]}
                  onPress={() => setWallet({ ...wallet, icon: iconName })}
                >
                  {renderIcon(iconName)}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        {oldWallet?.id && !loading && (
          <Button
            onPress={showDeleteAlert}
            style={{
              backgroundColor: colors.rose,
              paddingHorizontal: spacingX._15,
            }}
          >
            <Icons.Trash
              color={colors.white}
              size={verticalScale(24)}
              weight="bold"
            />
          </Button>
        )}
        <Button onPress={onSubmit} style={{ flex: 1 }} loading={loading}>
          <Typo color={colors.black} fontWeight={"700"}>
            {oldWallet?.id ? t("common.update") : t("common.add")}
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default WalletModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacingY._20,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
    borderWidth: 1,
    borderColor: colors.neutral500,
  },
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._7,
    borderRadius: 100,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: spacingY._7,
  },
  inputContainer: {
    gap: spacingY._10,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(12),
    padding: spacingX._10,
    backgroundColor: colors.neutral800,
    borderRadius: radius._10,
    paddingHorizontal: spacingX._5,
  },
  iconButton: {
    width: verticalScale(40),
    height: verticalScale(40),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius._10,
    backgroundColor: colors.neutral700,
  },
});
