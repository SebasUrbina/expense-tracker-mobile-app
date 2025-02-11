import { ViewStyle } from "react-native";

export type UserDataType = {
  name: string;
  image?: any;
};

export type ResponseType = {
  success: boolean;
  data?: any;
  msg?: string;
};

export type WalletType = {
  id?: string;
  name: string;
  amount?: number;
  totalIncome?: number;
  totalExpenses?: number;
  image: any;
  uid?: string;
  created?: Date;
};

export type ImageUploadProps = {
  file?: any;
  onSelect?: (file: any) => void;
  onClear?: () => void;
  containerStyle?: ViewStyle;
  imageStyle?: ViewStyle;
  placeholder?: string;
};
