import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { colors, spacingY } from "@/constants/theme";
import ModalWrapper from "@/components/ModalWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import { ScrollView } from "react-native";
import Input from "@/components/Input";
import { useAuth } from "@/contexts/authContext";
import { TransactionType } from "@/types";
import { orderBy, where } from "firebase/firestore";
import useFetchData from "@/hooks/useFetchData";
import TransactionList from "@/components/TransactionList";
import { useTranslation } from "react-i18next";

const SearchModal = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const { t } = useTranslation();

  const contraints = [where("uid", "==", user?.uid), orderBy("date", "desc")];

  const {
    data: allTransactions,
    loading: transactionLoading,
    error,
  } = useFetchData<TransactionType>("transactions", contraints);

  const filteredTransactions = allTransactions.filter((item) => {
    if (search.length > 1) {
      if (
        item.category
          ?.toLocaleLowerCase()
          ?.includes(search?.toLocaleLowerCase()) ||
        item.type?.toLocaleLowerCase()?.includes(search?.toLocaleLowerCase()) ||
        item.description
          ?.toLocaleLowerCase()
          ?.includes(search?.toLocaleLowerCase())
      ) {
        return true;
      }
      return false;
    }
    return true;
  });

  return (
    <ModalWrapper style={{ backgroundColor: colors.neutral900 }}>
      <View style={styles.container}>
        <Header
          title={t("common.search")}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        {/* input search form */}
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Input
              placeholder="shoes..."
              value={search}
              placeholderTextColor={colors.neutral400}
              containerStyle={{ backgroundColor: colors.neutral800 }}
              onChangeText={(value) => setSearch(value)}
            />
          </View>

          <View>
            <TransactionList
              loading={transactionLoading}
              data={filteredTransactions}
              emptyListMessage={t("common.noResults")}
            />
          </View>
        </ScrollView>
      </View>
    </ModalWrapper>
  );
};

export default SearchModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacingY._20,
  },

  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  inputContainer: {
    gap: spacingY._10,
  },
});
