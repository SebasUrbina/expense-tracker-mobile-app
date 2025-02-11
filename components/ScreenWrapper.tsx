import {
  StyleSheet,
  View,
  ViewStyle,
  Platform,
  Dimensions,
  StatusBar,
} from "react-native";
import React from "react";
import { verticalScale } from "@/utils/styling";
import { colors } from "@/constants/theme";

type ScreenWrapperProps = {
  style?: ViewStyle;
  children: React.ReactNode;
};

const { height } = Dimensions.get("window");

const ScreenWrapper = ({ style, children }: ScreenWrapperProps) => {
  let paddingTop = Platform.OS == "ios" ? height * 0.06 : 50;
  return (
    <View
      style={[
        {
          paddingTop,
          flex: 1,
          backgroundColor: colors.neutral900,
        },
        style,
      ]}
    >
      <StatusBar barStyle="light-content" />
      {children}
    </View>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({});
