// server/controllers/adminController.js
import { getDB } from '../database.js';
import bcrypt from 'bcryptjs';
export const getAllUsers = async (req, res) => {
  

  try {
    const db = await getDB();
    const users = db.collection('users');

    const allUsers = await users.find({}, {
      projection: {
        password: 0, // Hide sensitive data
        _id: 0       // Optional: exclude MongoDB _id
      }
    }).toArray();

    console.log(`✅ Fetched ${allUsers.length} users`);
    res.status(200).json(allUsers);

  } catch (err) {
    console.error('❌ Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


//  Delete a user and all their related transactions
export const deleteUser = async (req, res) => {
  try {
    const db = await getDB();
    const { email ,userId } = req.body;

    // Delete user from users collection
    await db.collection('users').deleteOne({ email: email});

    // Delete user's transactions
    await db.collection('transactions').deleteMany({ userId: userId });

    res.status(200).json({ message: 'User and related transactions deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

//  Get all transactions, with optional filters (user, type, status, date range)
export const getAllTransactions = async (req, res) => {
    console.log("api gets a call")
  try {
    const db = await getDB();
    const { userId, type, status, startDate, endDate } = req.query;

    const query = {};
    if (userId && userId !== 'all') {
        query.userId = userId; // Filter by specific userId
      }
  
      if (type) query.type = type; // filter by type: internal or external
      if (status) query.status = status; // filter by status: success or failed
      if (startDate && endDate) {
        query.date = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }
    console.log(JSON.stringify(query, null, 2))

    const transactions = await db.collection('transactionLog').find(query).toArray()
    res.status(200).json(transactions);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ message: 'Server error' });
  }
  
};
export const updateUserProfileAdmin = async (req, res) => {
  console.log("function is being called")
  const db = await getDB();
  const users = db.collection('users');
  const { email, firstName, lastName, phoneNumber } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required to identify the user.' });
  }

  try {
    const result = await users.updateOne(
      { email },
      {
        $set: {
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(phoneNumber && { phoneNumber })
        }
      }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Profile updated successfully.' });
      console.log("response gets a message")
    } else {
      res.status(400).json({ message: 'No changes made or user not found.' });
    }
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

export const createUser = async (req, res) => {
  console.log("create user gets call")
  const db = await getDB();
  
  const users = db.collection('users');
  const { firstName, lastName, email, password, phoneNumber } = req.body;
 
  try {
    const userExists = await users.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    const userIdGeneration = ()=>{
      if (!firstName || !lastName) {
        throw new Error('Missing firstName or lastName in userIdGeneration');
      }
        const initials = firstName.charAt(0) +  lastName.charAt(0);
        return initials + Math.floor(1000 + Math.random() * 900).toString();
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const accountNumberGeneration = ()=>{return Math.floor(1000000000 + Math.random() * 9000000000).toString();}
    console.log(accountNumberGeneration());

    const newUser = {
      userId: userIdGeneration(),
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      role: 'user',
      isActive: true,
      accounts: [
        {
          accountNumber: accountNumberGeneration(),
          accountType: 'Savings',
          amount: 10000
        },
        {
          accountNumber: accountNumberGeneration(),
          accountType: 'Checking',
          amount: 10000
        }
      ]
    };
    await users.insertOne(newUser);
    res.status(200).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};
