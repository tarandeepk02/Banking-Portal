import { getDB } from '../database.js';

export const getTransactionsByUserId = async (req, res) => {
  const db = await getDB();
  const transactions = db.collection('transactionLog');

  const  userId  = req.query.userId

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const result = await transactions.find({ userId }).toArray();
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error fetching transactions:", err);
    res.status(500).json({ message: 'Server Error' });
  }
};
