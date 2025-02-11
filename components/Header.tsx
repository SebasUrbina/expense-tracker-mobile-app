import { StyleSheet, Text, View, ViewStyle } from "react-native";
import React from "react";
import Typo from "./Typo";

type headerProps = {
  title?: string;
  style?: ViewStyle;
  leftIcon?: React.ReactNode;
  fill?: string;
};

const Header = ({ title = "", leftIcon, style }: headerProps) => {
  return (
    <View style={[styles.container, style]}>
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      {title && (
        <Typo
          size={22}
          fontWeight={"600"}
          style={{
            textAlign: "center",
            width: leftIcon ? "82%" : "100%",
          }}
        >
          {title}
        </Typo>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
  },
  leftIcon: {
    alignSelf: "flex-start",
  },
});
