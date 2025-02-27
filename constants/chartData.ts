import { scale } from "@/utils/styling";
import { colors } from "./theme";

const barData = [
  {
    value: 50,
    label: "Mon",
    spacing: scale(4),
    labelWidth: scale(30),
    frontColor: colors.primary,
    // optional to show the value of the bar
    // topLabelComponent: () => {
    //   <Typo size={10} style={{ marginBottom: 4 }} fontWeight={"bold"}>
    //     50
    //   </Typo>;
    // },
  },
  {
    value: 20,
    frontColor: colors.rose,
  },
  {
    value: 50,
    label: "Tue",
    spacing: scale(4),
    labelWidth: scale(30),
    frontColor: colors.primary,
  },
  {
    value: 40,
    frontColor: colors.rose,
  },
  {
    value: 20,
    label: "Wed",
    spacing: scale(4),
    labelWidth: scale(30),
    frontColor: colors.primary,
  },
  {
    value: 20,
    frontColor: colors.rose,
  },
];
