import { getDB } from '../database.js';

export const getUserDetails = async (req, res) => {
  try {
    const db = await getDB();
    const users = db.collection('users');
    const senderEmail = req.user?.email;

    if (!senderEmail) {
      return res.status(400).json({ message: 'Missing email from token' });
    }

    const user = await users.findOne({ email: senderEmail });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      accountNo: user.accountNo,
      accountBalance: user.accountBalance,
      phoneNumber: user.phoneNumber,
      role: user.role,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server Error' });
  }
};