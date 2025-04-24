import { getDB } from '../database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  const db = await getDB();
 
  const users = db.collection('users');
 

  const { firstName, lastName, email, password, phoneNumber } = req.body;
  
  try {
    const userExists = await users.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    const userIdGeneration = ()=>{
      if (!firstName || !lastName) {
        alert('Missing firstName or lastName in userIdGeneration');
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
          amount: 10000.0
        },
        {
          accountNumber: accountNumberGeneration(),
          accountType: 'Checking',
          amount: 10000.0
        }
      ]
    };
    console.log("Generated account numbers:", newUser.accounts.map(a => a.accountNumber));

    await users.insertOne(newUser);
    res.status(200).json({ message: 'User registered successfully' });

  } catch (err){
      console.error('Error registering user:', err);
      console.error('Full Error Object:', JSON.stringify(err, null, 2)); // Log the entire error
      res.status(500).json({ message: 'Server Error' });
    }
  }


export const loginUser = async (req, res) => {
  const db = await getDB();
  const users = db.collection('users');
  const { email, password } = req.body;

  // Validate that email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await users.findOne({ email });
    if (!user) return res.status(401).json({ message: 'User does not exist' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password credentials' });

    const token = jwt.sign(
      { email: user.email, userId: user.userId, role: user.role }, // ✅ Correct: uses `userId`
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    console.log("JWT Payload:", {
      email: user.email,
      userId: user.userId,
      role: user.role
    });
    console.log("🔥 userId from token:", req.user?.userId);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        user: user.userId,
        email: user.email,
        role: user.role
      }
    });
  
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateUserProfile = async (req, res) => {
  const db = await getDB();
  const users = db.collection('users');

  const { email, firstName, lastName, phoneNumber } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: userId missing from token' });
  }

  try {
    const result = await users.updateOne(
      { userId }, // 👈 custom field in DB
      {
        $set: {
          email,
          firstName,
          lastName,
          phoneNumber
        }
      }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Profile updated' });
    } else {
      res.status(400).json({ message: 'No changes made or user not found' });
    }
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

