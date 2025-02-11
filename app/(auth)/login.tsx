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
import { useAuth } from "@/contexts/authContext";
const Login = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login: loginUser } = useAuth();

  const handleSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Login", "Please fill all the fields");
      return;
    }
    setIsLoading(true);

    const res = await loginUser(emailRef.current, passwordRef.current);
    setIsLoading(false);
    if(!res.success){
      Alert.alert("Login", res.msg);
    }


    console.log("email", emailRef.current);
    console.log("password", passwordRef.current);
    console.log("good to go");
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* back button */}
        <BackButton iconSize={28} />

        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight={"800"}>
            Hey,
          </Typo>
          <Typo size={30} fontWeight={"800"}>
            Welcome back
          </Typo>

          {/* form */}
          <View style={styles.form}>
            <Typo size={16} color={colors.textLighter}>
              Login now to track all your expenses
            </Typo>

            {/* input */}
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

        <Typo size={14} color={colors.text} style={{ alignSelf: "flex-end" }}>
          Forgot password?
        </Typo>

        <Button onPress={handleSubmit} loading={isLoading}>
          <Typo fontWeight={"700"} color={colors.black} size={21}>
            Login
          </Typo>
        </Button>

        {/* footer */}
        <View style={styles.footer}>
          <Typo size={15}>Don't have account?</Typo>
          <Pressable onPress={() => router.navigate("/(auth)/register")}>
            <Typo size={15} fontWeight={"700"} color={colors.primary}>
              Sign Up
            </Typo>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Login;

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
