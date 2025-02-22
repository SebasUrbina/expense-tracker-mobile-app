import { firestore } from "@/config/firebase";
import { ResponseType, WalletType } from "@/types";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";

export const createOrUpdateWallet = async (
  walletData: Partial<WalletType>
): Promise<ResponseType> => {
  try {
    let walletToSave = { ...walletData };

    // TODO: Implement this https://www.youtube.com/watch?v=4g5yDAE9sR8&t=1105s
    if (walletData.image) {
    }

    if (!walletData?.id) {
      // new wallet
      walletToSave.amount = 0;
      walletToSave.totalIncome = 0;
      walletToSave.totalExpenses = 0;
      walletToSave.created = new Date();
    }

    const walletRef = walletData?.id
      ? doc(firestore, "wallets", walletData?.id)
      : doc(collection(firestore, "wallets"));

    await setDoc(walletRef, walletToSave, { merge: true }); // update only the data updated

    return { success: true, data: { ...walletToSave, id: walletRef.id } };
  } catch (error: any) {
    console.log("error creating or updating wallet", error);
    return {
      success: false,
      msg: error.message,
    };
  }
};

export const deleteWallet = async (walletId: string): Promise<ResponseType> => {
  try {
    const walletRef = doc(firestore, "wallets", walletId);
    await deleteDoc(walletRef);

    deleteTransactionByWalletId(walletId);

    return { success: true, msg: "Wallet deleted successfully" };
  } catch (err: any) {
    console.log("error deleting the wallet: ", err);
    return { success: false, msg: err.message };
  }
};

export const deleteTransactionByWalletId = async (
  walletId: string
): Promise<ResponseType> => {
  try {
    let hasMoreTransactions = true;
    while (hasMoreTransactions) {
      const transactionQuery = query(
        collection(firestore, "transactions"),
        where("walletId", "==", walletId)
      );

      const transactionSnapshot = await getDocs(transactionQuery);
      if (transactionSnapshot.size == 0) {
        hasMoreTransactions = false;
        break;
      }

      const batch = writeBatch(firestore);

      transactionSnapshot.forEach((transactionDoc) => {
        batch.delete(transactionDoc.ref);
      });

      await batch.commit();

      console.log(
        `${transactionSnapshot.size} transactions deleted in this batch`
      );
    }

    return { success: true, msg: "All transactions deleted successfully" };
  } catch (err: any) {
    console.log("error deleting the transactions: ", err);
    return { success: false, msg: err.message };
  }
};
