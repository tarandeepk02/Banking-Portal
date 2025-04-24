import { getDB } from "../database.js";

export const makeTransfer = async (req, res) => {
  const db = await getDB();
  const users = db.collection("users");
  const transactionLog = db.collection("transactionLog");

  const senderEmail = req.user.email;

  const senderDocument = await users.findOne(
    { email: req.user.email },
    { projection: { userId: 1 } }
  );

  const senderId = senderDocument?.userId;

  if (!senderId) {
    return res.status(404).json({ message: "Sender ID not found." });
  }

  if (!senderEmail) {
    return res.status(400).json({ message: "Sender email required." });
  }

  const transactionIdGeneration = () => {
    return "TXN" + Math.floor(100000 + Math.random() * 900000).toString();
  };

  const { senderAccount, receiverAccount, amount, transferType, receiverEmail } = req.body;
  const numericAmount = Number(amount);

  let transferStatus = "pending";
  let transferStatusMessage = "Transfer pending.";

  try {
    if (transferType === "internal") {
      const secondAccountStr = String(receiverAccount);

      const receiver = await users.findOne(
        { "accounts.accountNumber": String(secondAccountStr) },
        { projection: { "accounts.$": 1, _id: 0 } }
      );

      if (!receiver) {
        transferStatusMessage = "Receiver account not found";
        transferStatus = "failed";
        return res.status(404).json({ message: "Receiving account not found." });
      }

      const accountInfo = await users.findOne(
        { email: senderEmail, "accounts.accountNumber": senderAccount },
        { projection: { "accounts.$": 1, _id: 0 } }
      );

      if (!accountInfo || !accountInfo.accounts || accountInfo.accounts.length === 0) {
        transferStatusMessage = "Sender account not found or doesn't match";
        transferStatus = "failed";
        return res.status(404).json({ message: "Sender account not found" });
      }

      const accountBalance = accountInfo.accounts[0].amount;
      if (accountBalance < numericAmount) {
        transferStatusMessage = "Insufficient balance";
        transferStatus = "failed";
        return res.status(400).json({ message: "Insufficient amount in account" });
      }

      await users.updateOne(
        { "accounts.accountNumber": senderAccount },
        { $inc: { "accounts.$.amount": -numericAmount } }
      );
      await users.updateOne(
        { "accounts.accountNumber": receiverAccount },
        { $inc: { "accounts.$.amount": numericAmount } }
      );
      transferStatusMessage = "Internal Transfer Successful";
      transferStatus = "success";
      return res.status(200).json({ message: "Transfer successful" });
    } else {
      const senderCheckingAccount = await users.findOne(
        { email: senderEmail, "accounts.accountType": "Checking" },
        { projection: { "accounts.$": 1, _id: 0 } }
      );

      if (!senderCheckingAccount || !senderCheckingAccount.accounts || senderCheckingAccount.accounts.length === 0) {
        transferStatusMessage = "Sender Checking account not found.";
        transferStatus = "failed";
        return res.status(404).json({ message: "Sender Checking account not found." });
      }

      const senderAccountNumber = senderCheckingAccount.accounts[0].accountNumber;
      const senderBalance = senderCheckingAccount.accounts[0].amount;

      if (senderBalance < numericAmount) {
        transferStatus = "failed";
        transferStatusMessage = "Insufficient balance in Checking account";
        return res.status(400).json({ message: "Insufficient balance in Checking account." });
      }

      const receiverSavingsAccount = await users.findOne(
        { email: receiverEmail, "accounts.accountType": "Savings" },
        { projection: { "accounts.$": 1, _id: 0 } }
      );

      if (!receiverSavingsAccount || !receiverSavingsAccount.accounts || receiverSavingsAccount.accounts.length === 0) {
        transferStatus = "failed";
        transferStatusMessage = "Receiver Savings account not found";
        return res.status(404).json({ message: "Receiver Savings account not found." });
      }

      const receiverAccountNumber = receiverSavingsAccount.accounts[0].accountNumber;

      await users.updateOne(
        { email: senderEmail, "accounts.accountNumber": senderAccountNumber },
        { $inc: { "accounts.$.amount": -numericAmount } }
      );
      await users.updateOne(
        { email: receiverEmail, "accounts.accountNumber": receiverAccountNumber },
        { $inc: { "accounts.$.amount": numericAmount } }
      );
      transferStatus = "success";
      transferStatusMessage = "External transfer Successful";
      return res.status(200).json({ message: "External transfer successful." });
    }
  } catch (err) {
    return res.status(500).json({ message: "Transfer failed: " + err.message });
  } finally {
    let newTransaction;
    try {
      newTransaction = {
        userId: senderId,
        transactionId: transactionIdGeneration(),
        date: new Date(),
        type: transferType,
        amount: parseFloat(amount),
        status: transferStatus,
        reason: transferStatusMessage,
      };
      await transactionLog.insertOne(newTransaction);
    } catch (logErr) {
      console.error("❌ Failed to log transaction:", logErr);
     
      
    }
  }
};