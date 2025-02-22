import { firestore } from "@/config/firebase";
import { ResponseType, TransactionType, WalletType } from "@/types";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export const createOrUpdateTransaction = async (
  transactionData: Partial<TransactionType>
): Promise<ResponseType> => {
  try {
    //TODO: delete all the transactions related to this wallet
    const { id, type, walletId, amount, image } = transactionData;
    if (!amount || amount < 0 || !walletId || !type) {
      return { success: false, msg: "Invalid transaction data" };
    }

    if (id) {
      //TODO: update existing transaction
    } else {
      //TODO: update wallet for new transaction
      //TODO: updatewallet
      let res = await updateWalletForNewTransaction(
        walletId!,
        Number(amount!),
        type
      );
      if (!res.success) return res;
    }

    //TODO: Implement image service: https://youtu.be/SzUhQHLFrn8?si=wMibUFU0RdTSljVf&t=544

    const transactionRef = id
      ? doc(firestore, "transactions", id)
      : doc(collection(firestore, "transactions"));

    await setDoc(transactionRef, transactionData, { merge: true });

    return {
      success: true,
      data: { ...transactionData, id: transactionRef.id },
    };
  } catch (err: any) {
    console.log("error creating or updating the transaction", err);
    return { success: false, msg: err.message };
  }
};

const updateWalletForNewTransaction = async (
  walletId: string,
  amount: number,
  type: string
) => {
  try {
    const walletRef = doc(firestore, "wallets", walletId);
    const walletSnapshot = await getDoc(walletRef);
    if (!walletSnapshot.exists()) {
      console.log("error updating wallet for new transaction");
      return { success: false, msg: "Wallet not found" };
    }

    const walletData = walletSnapshot.data() as WalletType;
    const { totalIncome, totalExpenses } = walletData;

    if (type == "expense" && walletData.amount! - amount < 0) {
      return {
        success: false,
        msg: "Selected wallet don't have enough balance",
      };
    }

    const updatedType = type == "income" ? "totalIncome" : "totalExpenses";
    const updatedWalletAmount =
      type == "income"
        ? Number(walletData.amount) + amount
        : Number(walletData.amount) - amount;

    const updateTotals =
      type == "income"
        ? Number(walletData.amount) + amount
        : Number(walletData.amount) + amount;

    await updateDoc(walletRef, {
      amount: updatedWalletAmount,
      [updatedType]: updateTotals,
    });
    return { success: true };
  } catch (err: any) {
    console.log(
      "error creating or updating the wallet for new transaction: ",
      err
    );
    return { success: false, msg: err.message };
  }
};
