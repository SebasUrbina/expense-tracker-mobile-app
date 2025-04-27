import { StyleSheet, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Typo from "./Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { ImageBackground } from "expo-image";
import * as Icons from "phosphor-react-native";
import { TransactionType } from "@/types";
import useFetchData from "@/hooks/useFetchData";
import { orderBy, where } from "firebase/firestore";
import { useAuth } from "@/contexts/authContext";
import { parseAmount } from "@/utils/common";

// Tipo para los filtros de tiempo
type TimeFilterType = "month" | "year" | "all";

const HomeCard = () => {
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>("month");
  const { user } = useAuth();

  const {
    data: transactions,
    loading: transactionsLoading,
    error: transactionsError,
  } = useFetchData<TransactionType>("transactions", [
    where("uid", "==", user?.uid),
    orderBy("date", "desc"),
  ]);

  const getFilteredTransactions = () => {
    if (timeFilter === "all" || !transactions.length) {
      return transactions;
    }

    const now = new Date();
    const filtered = transactions.filter((transaction: TransactionType) => {
      // Manejo seguro de la fecha de transacción
      let transactionDate: Date;
      if (transaction.date) {
        // Si transaction.date es un objeto de Firestore con método toDate()
        if (
          typeof transaction.date === "object" &&
          "toDate" in transaction.date &&
          typeof transaction.date.toDate === "function"
        ) {
          transactionDate = (transaction.date.toDate as Function)();
        } else {
          // Si es un string o timestamp de JS
          transactionDate = new Date(transaction.date as any);
        }
      } else {
        // Si no hay fecha, usar fecha actual (esto no debería ocurrir)
        return false;
      }

      if (timeFilter === "month") {
        return (
          transactionDate.getMonth() === now.getMonth() &&
          transactionDate.getFullYear() === now.getFullYear()
        );
      } else if (timeFilter === "year") {
        return transactionDate.getFullYear() === now.getFullYear();
      }

      return true;
    });

    return filtered;
  };

  const getTotals = () => {
    const filteredTransactions = getFilteredTransactions();

    return filteredTransactions.reduce(
      (totals: any, item: TransactionType) => {
        if (item.type === "income") {
          totals.income += Number(item.amount);
          totals.balance += Number(item.amount);
        } else if (item.type === "expense") {
          totals.expenses += Number(item.amount);
          totals.balance -= Number(item.amount);
        }
        return totals;
      },
      { balance: 0, income: 0, expenses: 0 }
    );
  };

  const getFilterLabel = (): string => {
    switch (timeFilter) {
      case "month":
        return "Month";
      case "year":
        return "Year";
      case "all":
        return "All";
      default:
        return "Month";
    }
  };

  const handleFilterChange = (filter: TimeFilterType) => {
    setTimeFilter(filter);
  };

  const isLoading = transactionsLoading;

  return (
    <ImageBackground
      source={require("../assets/images/card.png")}
      resizeMode="stretch"
      style={styles.bgImage}
    >
      <View style={styles.container}>
        {/* total balance */}
        <View style={styles.totalBalanceRow}>
          <Typo color={colors.neutral800} size={17} fontWeight={"500"}>
            Total Balance
          </Typo>
          <View style={styles.filterContainer}>
            <Typo color={colors.neutral700} size={14} fontWeight={"500"}>
              {getFilterLabel()}
            </Typo>
            <TouchableOpacity
              onPress={() => {
                const nextFilter: Record<TimeFilterType, TimeFilterType> = {
                  month: "year",
                  year: "all",
                  all: "month",
                };
                handleFilterChange(nextFilter[timeFilter]);
              }}
            >
              <Icons.CalendarMinus
                size={verticalScale(16)}
                color={colors.black}
                weight="bold"
              />
            </TouchableOpacity>
          </View>
        </View>
        <Typo color={colors.black} size={30} fontWeight={"bold"}>
          $ {isLoading ? "----" : parseAmount(getTotals()?.balance)}
        </Typo>

        {/* total expense and income */}
        <View style={styles.stats}>
          {/* income */}
          <View style={{ gap: verticalScale(5) }}>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <Icons.ArrowDown
                  size={verticalScale(15)}
                  color={colors.black}
                  weight="bold"
                />
              </View>
              <Typo color={colors.neutral700} size={16} fontWeight={"500"}>
                Income
              </Typo>
            </View>

            <View style={{ alignSelf: "center" }}>
              <Typo size={17} color={colors.green} fontWeight={"600"}>
                $ {isLoading ? "----" : parseAmount(getTotals()?.income)}
              </Typo>
            </View>
          </View>
          {/* expenses */}
          <View style={{ gap: verticalScale(5) }}>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <Icons.ArrowUp
                  size={verticalScale(15)}
                  color={colors.black}
                  weight="bold"
                />
              </View>
              <Typo color={colors.neutral700} size={16} fontWeight={"500"}>
                Expense
              </Typo>
            </View>

            <View style={{ alignSelf: "center" }}>
              <Typo size={17} color={colors.rose} fontWeight={"600"}>
                $ {isLoading ? "----" : parseAmount(getTotals()?.expenses)}
              </Typo>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default HomeCard;

const styles = StyleSheet.create({
  bgImage: {
    height: scale(210),
    width: "100%",
  },

  container: {
    padding: spacingX._20,
    paddingHorizontal: scale(23),
    height: "87%",
    width: "100%",
    justifyContent: "space-between",
  },

  totalBalanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._5,
  },

  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statsIcon: {
    backgroundColor: colors.neutral350,
    padding: spacingY._5,
    borderRadius: 50,
  },
  incomeExpense: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._7,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutral350,
    borderRadius: 20,
    paddingHorizontal: spacingX._10,
    paddingVertical: spacingY._5,
    gap: spacingX._5,
  },
});
