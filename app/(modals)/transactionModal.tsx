import {
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  View,
  TouchableOpacity,
  Keyboard,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import * as Icons from "phosphor-react-native";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import ModalWrapper from "@/components/ModalWrapper";
import { scale, verticalScale } from "@/utils/styling";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import BackButton from "@/components/BackButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import { paramType, TransactionType, WalletType } from "@/types";
import Header from "@/components/Header";
import Typo from "@/components/Typo";
import { MenuProvider } from "react-native-popup-menu";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuth } from "@/contexts/authContext";
import useFetchData from "@/hooks/useFetchData";
import { orderBy, where } from "firebase/firestore";
import { parseAmount } from "@/utils/common";
import { expenseCategories } from "@/constants/data";
import {
  createOrUpdateTransaction,
  deleteTransaction,
} from "@/services/transactionService";
import Button from "@/components/Button";
import { useTranslation } from "react-i18next";

const TransactionModal = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);
  const { t } = useTranslation();

  //TODO: Implemente image service and recurrent transaction
  const [transaction, setTransaction] = useState<TransactionType>({
    type: "expense",
    amount: 0,
    description: "",
    category: "",
    date: new Date(),
    walletId: "",
    image: null,
  });

  // Refs
  const amountInputRef = useRef<TextInput>(null);
  const descriptionInputRef = useRef<TextInput>(null);

  const {
    data: wallets,
    loading: walletLoading,
    error: walletError,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  type paramType = {
    id: string;
    type: string;
    amount: string;
    category: string;
    date: string;
    description: string;
    image: string;
    uid: string;
    walletId: string;
  };
  const oldTransaction: paramType = useLocalSearchParams();

  const onOpenDatePicker = () => {
    Keyboard.dismiss();
    setShowDatePicker(true);
  };
  const onDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || transaction.date;
    setTransaction({ ...transaction, date: currentDate });
    setShowDatePicker(Platform.OS == "ios" ? true : false);
  };

  const onConfirmDateChange = () => {
    setShowDatePicker(false);
    if (amountInputRef.current) {
      amountInputRef.current.focus(); // Reabrir el teclado en el campo de cantidad
    } else if (descriptionInputRef.current) {
      descriptionInputRef.current.focus();
    }
  };

  useEffect(() => {
    if (oldTransaction?.id) {
      setTransaction({
        type: oldTransaction?.type,
        amount: Number(oldTransaction.amount),
        description: oldTransaction?.description || "",
        category: oldTransaction?.category || "",
        date: new Date(oldTransaction?.date),
        image: oldTransaction?.image,
        walletId: oldTransaction?.walletId,
      });
    }
  }, []);

  const selectWallet = (wallet: WalletType) => {
    setSelectedWallet(wallet);
    setTransaction({ ...transaction, walletId: wallet.id || "" });
  };

  const selectCategory = (category: string) => {
    setTransaction({ ...transaction, category });
  };

  const areFieldsFilled = () => {
    const { type, amount, description, category, date, walletId } = transaction;
    return walletId && date && amount && (type !== "expense" || category);
  };

  const onSubmit = async () => {
    if (!areFieldsFilled()) {
      Alert.alert("Transaction", t("alerts.fillFields"));
      return;
    }

    const { type, amount, description, category, date, walletId, image } =
      transaction;
    let transactionData: TransactionType = {
      type,
      amount,
      description,
      category,
      date,
      walletId,
      image: image ? image : null,
      uid: user?.uid,
    };

    console.log("Transaction data: ", transactionData);

    //TODO: include transaction id for updating
    if (oldTransaction?.id) transactionData.id = oldTransaction.id;
    setLoading(true);
    const res = await createOrUpdateTransaction(transactionData);
    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Transaction", res.msg);
    }
  };
  const onDelete = async () => {
    // console.log("deleting wallet: ", oldTransaction?.id);
    if (!oldTransaction?.id) return;
    setLoading(true);
    const res = await deleteTransaction(
      oldTransaction?.id,
      oldTransaction.walletId
    );
    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Transaction", res.msg);
    }
  };
  const showDeleteAlert = () => {
    Alert.alert(t("common.confirm"), t("transactions.deleteConfirm"), [
      {
        text: t("common.cancel"),
        style: "cancel",
        onPress: () => console.log("cancel delete"),
      },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: () => onDelete(),
      },
    ]);
  };
  //TODO: Implemente recurrent options
  const recurrentOptions = [
    {
      name: "Today",
      id: "today",
    },
    { name: "Weekly", id: "weekly" },
  ];

  return (
    <ModalWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 40}
      >
        <MenuProvider>
          <View style={styles.container}>
            {/* Main Container */}
            <Header
              title={
                oldTransaction?.id
                  ? t("transactions.update")
                  : t("transactions.add")
              }
              leftIcon={<BackButton />}
              style={{ marginBottom: spacingY._10 }}
            />
            {/* Top menu options container */}
            <View style={styles.topMenu}>
              {/* # TODO: Use PopUpMenu component (fix error) */}
              <Menu>
                <MenuTrigger onPress={onOpenDatePicker}>
                  <View style={styles.menuButton}>
                    <Typo size={14} color={colors.white}>
                      {(transaction.date as Date).toLocaleDateString() ===
                      new Date().toLocaleDateString()
                        ? t("common.today")
                        : (transaction.date as Date).toLocaleDateString()}
                    </Typo>
                    <Icons.CaretDown
                      size={verticalScale(16)}
                      color={colors.white}
                    />
                  </View>
                </MenuTrigger>
              </Menu>
              <Menu>
                <MenuTrigger>
                  <View style={styles.menuButton}>
                    <Typo size={14} color={colors.white}>
                      {selectedWallet?.name || t("common.selectWallet")}
                    </Typo>
                    <Icons.CaretDown
                      size={verticalScale(16)}
                      color={colors.white}
                    />
                  </View>
                </MenuTrigger>
                <MenuOptions customStyles={menuOptionsStyles}>
                  {wallets.map((wallet) => (
                    <MenuOption
                      key={wallet.id}
                      text={`${wallet.name}\n$${parseAmount(wallet.amount)}`}
                      onSelect={() => selectWallet(wallet)}
                    />
                  ))}
                </MenuOptions>
              </Menu>
            </View>

            {/* Contenedor principal para descripción y monto */}
            <View style={styles.mainContainer}>
              {/* Description input */}
              <TextInput
                ref={descriptionInputRef}
                style={styles.descriptionInput}
                placeholder={t("common.description")}
                placeholderTextColor={colors.neutral600}
                value={transaction.description}
                onChangeText={(value) =>
                  setTransaction({
                    ...transaction,
                    description: value,
                  })
                }
                onSubmitEditing={() => {
                  if (amountInputRef.current) {
                    amountInputRef.current.focus();
                  }
                }}
                returnKeyType="next"
              />
              <View style={styles.amountInputContainer}>
                {/* Amount input */}
                <Typo
                  size={24}
                  color={colors.neutral300}
                  style={{ marginRight: 8 }}
                >
                  {transaction.type === "income" ? "+" : "-"}
                </Typo>
                <TextInput
                  ref={amountInputRef}
                  style={[
                    styles.amountInput,
                    {
                      color:
                        transaction.type === "income"
                          ? colors.primary
                          : colors.rose,
                    },
                  ]}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.neutral600}
                  value={
                    transaction.amount
                      ? "$" + parseAmount(transaction.amount)
                      : ""
                  }
                  onChangeText={(value) =>
                    setTransaction({
                      ...transaction,
                      amount: Number(value.replace(/[^0-9]/g, "")),
                    })
                  }
                  onSubmitEditing={() => console.log("done")}
                />
              </View>
            </View>

            {/* Income/Expense button */}
            {/* #TODO: Create components for buttons */}
            <View style={styles.typeToggleContainer}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: colors.neutral500,
                  flexDirection: "row",
                  borderRadius: radius._15,
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.typeToggleButton,
                    transaction.type === "expense" &&
                      styles.typeToggleActiveExpense,
                  ]}
                  onPress={() =>
                    setTransaction({ ...transaction, type: "expense" })
                  }
                >
                  <Typo
                    size={24}
                    color={
                      transaction.type === "expense"
                        ? colors.white
                        : colors.neutral400
                    }
                    fontWeight={transaction.type === "expense" ? "700" : "400"}
                  >
                    -
                  </Typo>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeToggleButton,
                    transaction.type === "income" &&
                      styles.typeToggleActiveIncome,
                  ]}
                  onPress={() =>
                    setTransaction({ ...transaction, type: "income" })
                  }
                >
                  <Typo
                    size={24}
                    color={
                      transaction.type === "income"
                        ? colors.white
                        : colors.neutral400
                    }
                    fontWeight={transaction.type === "income" ? "700" : "400"}
                  >
                    +
                  </Typo>
                </TouchableOpacity>
              </View>
              {oldTransaction?.id && !loading && (
                <Button
                  onPress={showDeleteAlert}
                  style={{
                    backgroundColor: colors.neutral500,
                    paddingHorizontal: spacingX._15,
                    marginLeft: spacingX._15,
                  }}
                >
                  <Icons.Trash
                    color={colors.white}
                    size={verticalScale(24)}
                    weight="bold"
                  />
                </Button>
              )}

              <Button
                onPress={onSubmit}
                style={{
                  flex: 1,
                  backgroundColor: areFieldsFilled()
                    ? colors.primary
                    : colors.neutral500,
                  marginHorizontal: spacingX._15,
                }}
                loading={loading}
              >
                <Typo color={colors.white} fontWeight={"700"}>
                  ✓
                </Typo>
              </Button>
            </View>

            {/* Categories (just for expense) */}
            {transaction.type === "expense" && (
              <View style={styles.categoriesContainer}>
                <ScrollView
                  horizontal
                  style={styles.categoriesContent}
                  showsHorizontalScrollIndicator={true}
                  contentContainerStyle={{ paddingRight: spacingX._10 }}
                  keyboardShouldPersistTaps="handled"
                >
                  {Object.values(expenseCategories).map((category) => {
                    const isSelected = transaction.category === category.value;
                    const IconComponent = category.icon;

                    return (
                      <TouchableOpacity
                        key={category.value}
                        style={[
                          styles.categoryItem,
                          isSelected && {
                            backgroundColor: category.bgColor + "40",
                            borderColor: category.bgColor,
                            borderWidth: 1,
                          },
                        ]}
                        onPress={() => selectCategory(category.value)}
                      >
                        <View
                          style={[
                            styles.categoryIcon,
                            { backgroundColor: category.bgColor },
                          ]}
                        >
                          <IconComponent
                            size={24}
                            color={colors.white}
                            weight={isSelected ? "fill" : "regular"}
                          />
                        </View>
                        <Typo
                          size={10}
                          color={isSelected ? colors.white : colors.neutral300}
                          fontWeight={isSelected ? "600" : "400"}
                        >
                          {t(`transactionType.${category.value}`)}
                        </Typo>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            {/* Date Picker Modal */}
            {showDatePicker && (
              <View style={styles.pickerModal}>
                <View style={styles.pickerContainer}>
                  <View style={styles.pickerHeader}>
                    <Typo size={16} fontWeight="600">
                      {Platform.OS === "ios" ? "Select Date" : ""}
                    </Typo>
                  </View>

                  <DateTimePicker
                    themeVariant="dark"
                    value={transaction.date as Date}
                    textColor={colors.white}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={onDateChange}
                    style={styles.datePicker}
                  />

                  {Platform.OS === "ios" && (
                    <TouchableOpacity
                      style={styles.dateConfirmButton}
                      onPress={onConfirmDateChange}
                    >
                      <Typo size={16} fontWeight="600" color={colors.white}>
                        Confirm
                      </Typo>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </View>
        </MenuProvider>
      </KeyboardAvoidingView>
    </ModalWrapper>
  );
};

export default TransactionModal;

const menuOptionsStyles = {
  optionsContainer: {
    backgroundColor: colors.neutral800,
    borderRadius: radius._10,
    padding: spacingY._3,
    borderWidth: 1,
    borderColor: colors.neutral700,
  },
  optionText: {
    color: colors.white,
    borderBottomColor: colors.neutral700,
    borderBottomWidth: 1,
    fontSize: verticalScale(14),
    paddingVertical: spacingY._7,
    paddingHorizontal: spacingX._10,
  },
  optionWrapper: {
    paddingVertical: spacingY._3,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingY._20,
  },
  form: {
    gap: spacingY._20,
    paddingVertical: spacingY._15,
    paddingBottom: spacingY._40,
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
  inputContainer: {
    gap: spacingY._10,
  },
  iosDropDown: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    fontSize: verticalScale(14),
    borderWidth: 1,
    color: colors.white,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  androidDropDown: {
    // flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    fontSize: verticalScale(14),
    color: colors.white,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    // padingHorizontal: spacingX._15
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5,
  },
  dateInput: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  iosDataPicker: {},
  dataPickerButton: {
    backgroundColor: colors.neutral700,
    alignSelf: "flex-end",
    padding: spacingY._7,
    marginRight: spacingX._7,
    paddingHorizontal: spacingY._15,
    borderRadius: radius._10,
  },
  dropdownContainer: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  dropdownItemText: { color: colors.white },
  dropdownSelectedText: {
    color: colors.white,
    fontSize: verticalScale(14),
  },
  dropdownListContainer: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    borderCurve: "continuous",
    paddingVertical: spacingY._7,
    top: 5,
    borderColor: colors.neutral500,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
  dropdownPlaceholder: {
    color: colors.white,
  },
  dropdownItemContaine: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._15,
  },
  dropdownIcon: {
    height: verticalScale(30),
    tintColor: colors.neutral300,
  },
  topMenu: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: spacingY._15,
    gap: spacingX._5,
  },
  menuButton: {
    backgroundColor: colors.neutral800,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacingY._7,
    paddingHorizontal: spacingX._10,
    borderRadius: radius._15,
    borderWidth: 1,
    borderColor: colors.neutral700,
    gap: spacingX._5,
  },
  datePicker: {
    backgroundColor: colors.neutral800,
  },
  dateConfirmButton: {
    backgroundColor: colors.primary,
    borderRadius: radius._10,
    padding: spacingY._10,
    alignItems: "center",
    margin: spacingY._10,
  },
  pickerModal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  pickerContainer: {
    backgroundColor: colors.neutral800,
    borderRadius: radius._20,
    width: "90%",
    padding: spacingY._15,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._15,
    paddingHorizontal: spacingX._10,
  },
  mainContainer: {
    backgroundColor: colors.neutral800,
    borderRadius: radius._10,
    marginTop: spacingY._5,
    paddingHorizontal: spacingX._15,
    paddingVertical: spacingY._20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    gap: spacingY._20,
  },
  descriptionInput: {
    fontSize: verticalScale(20),
    color: colors.white,
    fontWeight: "bold",
    borderBottomColor: colors.neutral500,
    borderBottomWidth: 1,
    paddingTop: spacingY._10,
    paddingBottom: spacingY._10,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  amountInput: {
    fontSize: verticalScale(36),
    fontWeight: "bold",
    flex: 1,
  },
  typeToggleActiveExpense: {
    backgroundColor: colors.rose,
  },
  typeToggleActiveIncome: {
    backgroundColor: colors.primary,
  },
  typeToggleContainer: {
    position: "absolute",
    bottom: 20,
    left: spacingX._20,
    right: spacingX._20,
    flexDirection: "row",
    backgroundColor: colors.neutral800,
    borderRadius: radius._15,
    justifyContent: "center",
    // borderWidth: 1,
    // borderColor: colors.neutral500,
  },
  typeToggleButton: {
    paddingVertical: spacingY._7,
    paddingHorizontal: spacingX._20,
    borderRadius: radius._12,
  },
  categoriesContainer: {
    marginTop: spacingY._10,
  },
  categoriesContent: {
    marginBottom: spacingY._20,
    backgroundColor: colors.neutral800,
    borderRadius: radius._10,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryItem: {
    alignItems: "center",
    backgroundColor: colors.neutral800,
    borderRadius: radius._15,
    padding: spacingY._12,
    paddingHorizontal: spacingX._7,
    minWidth: scale(30),
  },
  categoryIcon: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacingY._5,
  },
});
