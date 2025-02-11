import { auth, firestore } from "@/config/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
type UserType = {
  uid?: string;
  email?: string | null;
  name: string | null;
  image?: any;
} | null;

type UserDataType = {
  name: string;
  image?: any;
};

type AuthContextType = {
  user: UserType;
  setUser: Function;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; msg?: string }>;
  register: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ success: boolean; msg?: string }>;
  updateUserData: (userId: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType>(null);
  const router = useRouter();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("firebase user: ", firebaseUser);
      //if get user from database
      if (firebaseUser) {
        setUser({
          uid: firebaseUser?.uid,
          email: firebaseUser?.email,
          name: firebaseUser?.displayName,
        });
        updateUserData(firebaseUser?.uid);
        router.replace("/(tabs)");
      } else {
        // if no user
        setUser(null);
        router.replace("/(auth)/welcome");
      }
    });

    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      let msg = error.message;
      console.log("error message: ", msg);
      if (msg.includes("(auth/invalid-credential)")) msg = "Wrong credentials";
      if (msg.includes("(auth/invalid-email)")) msg = "Invalid email";
      return { success: false, msg };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      let response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(firestore, "users", response?.user?.uid), {
        name,
        email,
        uid: response?.user?.uid,
      });
      return { success: true };
    } catch (error: any) {
      let msg = error.message;
      console.log("error message: ", msg);
      if (msg.includes("(auth/email-already-in-use)"))
        msg = "This email is already in use";
      if (msg.includes("(auth/invalid-email)")) msg = "Invalid email";
      return { success: false, msg };
    }
  };

  const updateUserData = async (uid: string) => {
    try {
      const docRef = doc(firestore, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const userData: UserType = {
          uid: data?.uid,
          email: data.email || null,
          name: data?.name || null,
          image: data.image || null,
        };
        setUser({ ...userData });
      }
    } catch (error: any) {
      let msg = error.message;
      console.log("error: ", error);
    }
  };

  const contextValue: AuthContextType = {
    user,
    setUser,
    login,
    register,
    updateUserData,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be wrapped inside AuthProvider");
  }
  return context;
};
