import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import Typo from "./Typo";
import { WalletType } from "@/types";
import { Router } from "expo-router";
import { verticalScale } from "@/utils/styling";
import { colors, radius, spacingX } from "@/constants/theme";
import * as Icons from "phosphor-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { parseAmount } from "@/utils/common";
import { walletIcons } from "@/constants/data";

const WalletListItem = ({
  item,
  index,
  router,
}: {
  item: WalletType;
  index: number;
  router: Router;
}) => {
  const openWallet = () => {
    router.push({
      pathname: "/(modals)/walletModal",
      params: {
        id: item?.id,
        name: item?.name,
        icon: item?.icon,
      },
    });
  };
  const IconComponent = walletIcons[item.icon as keyof typeof walletIcons];
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50)
        .springify()
        .damping(13)}
    >
      <TouchableOpacity style={styles.container} onPress={openWallet}>
        <View style={styles.iconContainer}>
          {IconComponent && (
            <IconComponent
              size={verticalScale(28)} // Aumentar el tamaño del ícono para mejor visibilidad
              color={colors.primary}
              weight="fill"
              style={styles.icon} // Aplicar estilo adicional
            />
          )}
        </View>
        <View style={styles.nameContainer}>
          <Typo size={16}>{item?.name}</Typo>
          <Typo size={14} color={colors.neutral400}>
            ${parseAmount(item?.amount)}
          </Typo>
        </View>

        <Icons.CaretRight
          size={verticalScale(20)}
          weight="bold"
          color={colors.white}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default WalletListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(17),
  },
  iconContainer: {
    height: verticalScale(45),
    width: verticalScale(45),
    borderWidth: 1,
    borderColor: colors.neutral600,
    borderRadius: radius._12,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    alignSelf: "center",
  },
  nameContainer: {
    flex: 1,
    gap: 2,
    marginLeft: spacingX._10,
  },
});
