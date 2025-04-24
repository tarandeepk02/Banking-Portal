import express from 'express';
import { registerUser, loginUser, updateUserProfile } from '../controllers/userController.js';
import { getUserDetails } from '../controllers/userDataController.js'; 
import verifyToken from '../middleware/authMiddleware.js';
import { makeTransfer } from '../Api/transfer.js';
import getUserData from '../Api/userData.js';
import LoginValidation from '../middleware/validators/loginValidator.js'
import registerValidator from '../middleware/validators/registerValidator.js'

import transactionValidator from '../middleware/validators/transferValidation.js';
import {
    getAllUsers,
  
    deleteUser,
    getAllTransactions,
    updateUserProfileAdmin,
    createUser 
  } from '../controllers/adminController.js';
//import { createUser } from '../adminApi/createUser.js';

const router = express.Router();
//home routes 
router.post('/register',registerValidator, registerUser);
router.post('/login',LoginValidation, loginUser);
//route to check user data veru
router.get('/details', verifyToken,getUserDetails);



//route to check the user existance 

//router.get('/transactions', getTransactionsByUserId);
//router.get('/getAllusers', getTransactionsByUserId);

//Admin routes 
router.post('/delete', verifyToken, deleteUser);
router.get('/transactions', verifyToken, getAllTransactions);
router.put('/update', updateUserProfileAdmin);
router.get('/users', verifyToken, getAllUsers);
router.post('/admin/createUser',registerValidator,createUser)
//user dashboard routes
router.get('/userData',verifyToken, getUserData);
router.post('/updateUser',verifyToken, updateUserProfile);
router.post('/transfer', verifyToken,transactionValidator,makeTransfer);
// ✅ Toggle active/inactive status of a user (using POST instead of PATCH)
// Expected req.body: { userId: "..." }
//router.post('/users/toggle-status', verifyToken, toggleUserStatus);

// ✅ Delete a user and related transactions (using POST instead of DELETE)
// Expected req.body: { userId: "..." }


// ✅ Get all transactions (optionally filtered)
// Optional query params: userId, type, status, startDate, endDate
router.get('/transactions', verifyToken, getAllTransactions);
router.put('/update', updateUserProfileAdmin);
export default router;
