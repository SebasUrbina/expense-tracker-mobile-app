import { StyleSheet, Text, TextStyle, TextProps } from "react-native";
import React from "react";
import { colors } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";

type TypoProps = {
  size?: number;
  color?: string;
  fontWeight?: TextStyle["fontWeight"];
  children: React.ReactNode;
  style?: TextStyle;
  textProps?: TextProps;
};

const Typo = ({
  size,
  color = colors.text,
  fontWeight = "400",
  children,
  style,
  textProps = {},
}: TypoProps) => {
  const textStyle: TextStyle = {
    fontSize: size ? verticalScale(size) : verticalScale(18),
    color,
    fontWeight,
  };
  return (
    <Text style={[textStyle, style]} {...textProps}>
      {children}
    </Text>
  );
};

export default Typo;

const styles = StyleSheet.create({});
