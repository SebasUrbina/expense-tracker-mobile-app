import { CategoryType, ExpenseCategoriesType } from "@/types";
import { colors } from "./theme";

import * as Icons from "phosphor-react-native"; // Import all icons dynamically

export const expenseCategories: ExpenseCategoriesType = {
  groceries: {
    label: "Groceries",
    value: "groceries",
    icon: Icons.ShoppingCart,
    bgColor: "#4B5563", // Deep Teal Green
  },
  lunch: {
    label: "Lunch",
    value: "lunch",
    icon: Icons.CookingPot,
    bgColor: "#b45309", // Dark Orange-Red
  },
  transportation: {
    label: "Transportation",
    value: "transportation",
    icon: Icons.Car,
    bgColor: "#0f766e", // Darker Red-Brown
  },
  subway: {
    label: "Subway",
    value: "subway",
    icon: Icons.Train,
    bgColor: "#0369a1", // Dark Blue
  },
  entertainment: {
    label: "Entertainment",
    value: "entertainment",
    icon: Icons.FilmStrip,
    bgColor: "#be185d", // Dark Red
  },
  health: {
    label: "Health",
    value: "health",
    icon: Icons.Heart,
    bgColor: "#e11d48", // Dark Purple
  },
  clothing: {
    label: "Clothing",
    value: "clothing",
    icon: Icons.TShirt,
    bgColor: "#7c3aed", // Dark Indigo
  },
  vacation: {
    label: "Vacation",
    value: "vacation",
    icon: Icons.Airplane,
    bgColor: "#0891b2", // Dark Blue
  },
  family: {
    label: "Family",
    value: "family",
    icon: Icons.Users,
    bgColor: "#4f46e5", // Dark Indigo
  },
  gifts: {
    label: "Gifts",
    value: "gifts",
    icon: Icons.Gift,
    bgColor: "#c026d3", // Dark Purple
  },
  savings: {
    label: "Savings",
    value: "savings",
    icon: Icons.PiggyBank,
    bgColor: "#065F46", // Deep Teal Green
  },
  subscriptions: {
    label: "Subscriptions",
    value: "subscriptions",
    icon: Icons.CalendarCheck,
    bgColor: "#9333ea", // Dark Indigo
  },
  rent: {
    label: "Rent",
    value: "rent",
    icon: Icons.House,
    bgColor: "#075985", // Dark Blue
  },
  commonExpenses: {
    label: "Common Expenses",
    value: "commonExpenses",
    icon: Icons.Buildings,
    bgColor: "#374151", // Dark Gray
  },
  water: {
    label: "Water",
    value: "water",
    icon: Icons.Drop,
    bgColor: "#0ea5e9", // Dark Blue
  },
  electricity: {
    label: "Electricity",
    value: "electricity",
    icon: Icons.Lightning,
    bgColor: "#f59e0b", // Dark Golden Brown
  },
  internet: {
    label: "Internet",
    value: "internet",
    icon: Icons.WifiHigh,
    bgColor: "#2563eb", // Dark Indigo
  },
  uber: {
    label: "Uber",
    value: "uber",
    icon: Icons.CarSimple,
    bgColor: "#18181b", // Dark Gray
  },
  trips: {
    label: "Trips",
    value: "trips",
    icon: Icons.MapTrifold,
    bgColor: "#15803d", // Dark Green
  },
  personal: {
    label: "Personal",
    value: "personal",
    icon: Icons.User,
    bgColor: "#a21caf", // Deep Pink
  },
  others: {
    label: "Others",
    value: "others",
    icon: Icons.DotsThreeOutline,
    bgColor: "#525252", // Neutral Dark Gray
  },
};

export const incomeCategory: CategoryType = {
  label: "Income",
  value: "income",
  icon: Icons.CurrencyDollarSimple,
  bgColor: "#16a34a", // Dark
};

export const transactionTypes = [
  { label: "Expense", value: "expense" },
  { label: "Income", value: "income" },
];

export const walletIcons = {
  Wallet: Icons.Wallet,
  PiggyBank: Icons.PiggyBank,
  Bank: Icons.Bank,
  Money: Icons.Money,
  Coins: Icons.Coins,
  CreditCard: Icons.CreditCard,
  Receipt: Icons.Receipt,
  ChartLine: Icons.ChartLine,
  ChartPie: Icons.ChartPie,
  House: Icons.House,
  Briefcase: Icons.Briefcase,
  ShoppingCart: Icons.ShoppingCart,
  Gift: Icons.Gift,
  Car: Icons.Car,
  Airplane: Icons.Airplane,
  Train: Icons.Train,
  Bus: Icons.Bus,
  Bicycle: Icons.Bicycle,
  Motorcycle: Icons.Motorcycle,
} as const;

export type WalletIconName = keyof typeof walletIcons;

export const availableIcons = Object.keys(walletIcons) as WalletIconName[];
