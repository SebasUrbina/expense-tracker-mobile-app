import { StyleSheet, View } from "react-native";
import React from "react";
import { colors, spacingY } from "@/constants/theme";
import ModalWrapper from "@/components/ModalWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTranslation } from "react-i18next";

const SettingsModal = () => {
  const { t } = useTranslation();
  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={t("common.settings")}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        <LanguageSelector />
      </View>
    </ModalWrapper>
  );
};

export default SettingsModal;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    paddingHorizontal: spacingY._20,
  },
});
