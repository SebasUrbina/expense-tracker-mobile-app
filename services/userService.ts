import { firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";

export const updateUser = async (
  uid: string,
  updateData: UserDataType
): Promise<ResponseType> => {
  try {
    // TODO: image upload pending: https://www.youtube.com/watch?v=HhyaedI2Oqg
    const userRef = doc(firestore, "users", uid);
    await updateDoc(userRef, updateData);

    return { success: true, msg: "User updated successfully" };
  } catch (error: any) {
    console.log("error updating user", error);
    return { success: false, msg: error?.message };
  }
};
