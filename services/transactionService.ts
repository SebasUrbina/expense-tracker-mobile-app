import { firestore } from "@/config/firebase";
import { ResponseType, TransactionType, WalletType } from "@/types";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { createOrUpdateWallet } from "./walletService";

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
      const oldTransactionSnapshot = await getDoc(
        doc(firestore, "transaction", id)
      );
      const oldTransaction = oldTransactionSnapshot.data() as TransactionType;
      const shouldRevertOriginal =
        oldTransaction.type != type ||
        oldTransaction.amount != amount ||
        oldTransaction.walletId != walletId;
      if (shouldRevertOriginal) {
        let res = await revertAndUpdateWallets(
          oldTransaction,
          Number(amount),
          type,
          walletId
        );
        if (!res.success) return res;
      }
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

const revertAndUpdateWallets = async (
  oldTransaction: TransactionType,
  newTransactionAmount: number,
  newTransactionType: string,
  newWalletId: string
) => {
  try {
    const originalWalletSnapshot = await getDoc(
      doc(firestore, "wallets", oldTransaction.walletId)
    );

    const originalWallet = originalWalletSnapshot.data() as WalletType;

    let newWalletSnapshot = await getDoc(
      doc(firestore, "wallets", newWalletId)
    );

    let newWallet = newWalletSnapshot.data() as WalletType;

    const revertType =
      oldTransaction.type == "income" ? "totalIncome" : "totalExpenses";

    const revertIncomeExpense: number =
      oldTransaction.type == "income"
        ? -Number(oldTransaction.amount)
        : Number(oldTransaction.amount);

    const revertedWalletAmount =
      Number(originalWallet.amount) + revertIncomeExpense;

    const revertedIncomeExpenseAmount =
      Number(originalWallet[revertType]) - Number(oldTransaction.amount);
    // wallet amount, after the transaction is removed

    if (newTransactionType == "expense") {
      // if user tries to convert income to expense on the same wallet
      // or if the user tries to increase to increase the expense amount and don't have enought balance
      if (
        oldTransaction.walletId == newWalletId &&
        revertedWalletAmount < newTransactionAmount
      ) {
        return {
          success: false,
          msg: "Selected wallet don't have enough balance",
        };
      }

      // if user tries to add expense from a new wallet but the wallet don't have enough balance
      if (newWallet.amount! < newTransactionAmount) {
        return {
          success: false,
          msg: "Selected wallet don't have enough balance",
        };
      }
    }

    await createOrUpdateWallet({
      id: oldTransaction.walletId,
      amount: revertedWalletAmount,
      [revertType]: revertedIncomeExpenseAmount,
    });
    // revert completed
    //////////////////////////////////////////////////////////////////////

    // refetch the newwallet because we may have just updated it
    newWalletSnapshot = await getDoc(doc(firestore, "wallets", newWalletId));
    newWallet = newWalletSnapshot.data() as WalletType;

    const updateType =
      newTransactionType == "income" ? "totalIncome" : "totalExpenses";

    const updatedTransactionAmount: number =
      newTransactionType == "income"
        ? Number(newTransactionAmount)
        : -Number(newTransactionAmount);

    const newWalletAmount = Number(newWallet.amount) + updatedTransactionAmount;

    const newIncomeExpenseAmount = Number(
      newWallet[updateType]! + Number(newTransactionAmount)
    );

    await createOrUpdateWallet({
      id: newWalletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpenseAmount,
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

export const deleteTransaction = async (
  transactionId: string,
  walletId: string
) => {
  try {
    const transactionSnapshot = await getDoc(
      doc(firestore, "transaction", transactionId)
    );

    if (!transactionSnapshot.exists()) {
      return { success: false, msg: "Transaction not found" };
    }
    const transactionData = transactionSnapshot.data() as TransactionType;

    const transactionType = transactionData?.type;
    const transactionAmount = transactionData?.amount;

    // fetch wallet to update amount, totalIncome or totalExpenses
    const WalletSnapshot = await getDoc(doc(firestore, "wallets", walletId));
    const walletData = WalletSnapshot.data() as WalletType;

    // check field to be updated based on transaction type
    const updateType =
      transactionType == "income" ? "totalIncome" : "totalExpenses";
    const newWalletAmount =
      walletData?.amount! -
      (transactionType == "income" ? transactionAmount : -transactionAmount);

    const newIncomeExpenseAmount = walletData[updateType]! - transactionAmount;

    // if its expense and the wallet amount can go below zero
    if (transactionType == "expense" && newWalletAmount < 0) {
      return { success: false, msg: "You cannot delete this transaction" };
    }

    await createOrUpdateWallet({
      id: walletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpenseAmount,
    });
    return { success: true };
  } catch (err: any) {
    console.log("error deleting the transaction: ", err);
    return { success: false, msg: err.message };
  }
};
