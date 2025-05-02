import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import Typo from "./Typo";

export const LanguageSelector = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typo style={styles.title}>{t("settings.language")}</Typo>
        <Typo style={styles.subtitle}>{t("settings.selectLanguage")}</Typo>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.languageOption,
            currentLanguage === "es" && styles.selectedOption,
          ]}
          onPress={() => changeLanguage("es")}
        >
          <View style={styles.flagContainer}>
            <Typo style={styles.emoji}>🇪🇸</Typo>
          </View>
          <View style={styles.languageInfo}>
            <Typo style={styles.languageName}>Español</Typo>
            <Typo style={styles.nativeName}>Spanish</Typo>
          </View>
          {currentLanguage === "es" && (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={colors.primary}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.languageOption,
            currentLanguage === "en" && styles.selectedOption,
          ]}
          onPress={() => changeLanguage("en")}
        >
          <View style={styles.flagContainer}>
            <Typo style={styles.emoji}>🇺🇸</Typo>
          </View>
          <View style={styles.languageInfo}>
            <Typo style={styles.languageName}>English</Typo>
            <Typo style={styles.nativeName}>Inglés</Typo>
          </View>
          {currentLanguage === "en" && (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={colors.primary}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacingX._15,
    backgroundColor: colors.neutral800,
    borderRadius: 12,
    marginVertical: spacingY._10,
  },
  header: {
    marginBottom: spacingY._15,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.neutral100,
  },
  subtitle: {
    fontSize: 14,
    color: colors.neutral400,
    marginTop: spacingY._3,
  },
  optionsContainer: {
    gap: spacingY._12,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacingX._12,
    backgroundColor: colors.neutral700,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.neutral600,
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: colors.neutral700,
  },
  flagContainer: {
    marginRight: spacingX._12,
  },
  emoji: {
    fontSize: 24,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.neutral100,
  },
  nativeName: {
    fontSize: 12,
    color: colors.neutral400,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacingY._15,
    gap: spacingX._7,
  },
});
