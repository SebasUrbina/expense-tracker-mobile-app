import { StyleSheet, Text, View, Pressable, Alert } from "react-native";
import React, { useRef, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import * as Icons from "phosphor-react-native";
import BackButton from "@/components/BackButton";
import { verticalScale } from "@/utils/styling";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { UseAuth } from "@/contexts/authContext";

const Register = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const nameRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register: registerUser } = UseAuth();
  const handleSubmit = async () => {
    if (!emailRef.current || !passwordRef.current || !nameRef.current) {
      Alert.alert("Sign Up", "Please fill all the fields");
      return;
    }

    setIsLoading(true);
    const res = await registerUser(
      emailRef.current,
      passwordRef.current,
      nameRef.current
    );
    setIsLoading(false);
    console.log("register result: ", res);
    if (!res.success) {
      Alert.alert("Sign Up", res.msg);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* back button */}
        <BackButton iconSize={28} />

        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight={"800"}>
            Let's,
          </Typo>
          <Typo size={30} fontWeight={"800"}>
            Get Started
          </Typo>

          {/* form */}
          <View style={styles.form}>
            <Typo size={16} color={colors.textLighter}>
              Create an account to track all your expenses
            </Typo>

            {/* input */}
            <Input
              placeholder="Enter your name"
              onChangeText={(value) => (nameRef.current = value)}
              icon={
                <Icons.User
                  size={verticalScale(26)}
                  color={colors.neutral300}
                  weight="fill"
                />
              }
            />
            <Input
              placeholder="Enter your email"
              onChangeText={(value) => (emailRef.current = value)}
              icon={
                <Icons.At
                  size={verticalScale(26)}
                  color={colors.neutral300}
                  weight="fill"
                />
              }
            />
            <Input
              placeholder="Enter your password"
              secureTextEntry
              onChangeText={(value) => (passwordRef.current = value)}
              icon={
                <Icons.Lock
                  size={verticalScale(26)}
                  color={colors.neutral300}
                  weight="fill"
                />
              }
            />
          </View>
        </View>

        <Button onPress={handleSubmit} loading={isLoading}>
          <Typo fontWeight={"700"} color={colors.black} size={21}>
            Sign Up
          </Typo>
        </Button>

        {/* footer */}
        <View style={styles.footer}>
          <Typo size={15}>Already have an account?</Typo>
          <Pressable onPress={() => router.navigate("/(auth)/login")}>
            <Typo size={15} fontWeight={"700"} color={colors.primary}>
              Login
            </Typo>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
  },
  form: {
    gap: spacingY._20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: colors.text,
    fontSize: verticalScale(15),
  },
});
