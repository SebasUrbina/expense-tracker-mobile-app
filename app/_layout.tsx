import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "@/contexts/authContext";

const StackLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* We add profileModal on this. */}
      <Stack.Screen
        name="(modals)/profileModal"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="(modals)/walletModal"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="(modals)/transactionModal"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="(modals)/searchModal"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <StackLayout />
    </AuthProvider>
  );
}

// const _layout = () => {
//   return <Stack screenOptions={{headerShown: false}}></Stack>;
// };

// export default _layout;

const styles = StyleSheet.create({});
