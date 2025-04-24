import { getDB } from '../database.js';

export const getUserData = async (req, res) => {
    console.log("yeag ")
    const senderEmail = req.user.email;
    const db = await getDB();
    const users = db.collection('users');
    
    const email = req.user?.email;
    if (!email) {
        
        return res.status(401).json({ message: 'Unauthorized: Email not present in token' });
    }

    try {
        const user = await users.findOne(
            { email:senderEmail },
            {
                projection: {
                    password: 0, 
                    _id: 0       
                }
            }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);

    } catch (err) {
        
        res.status(500).json({ message: 'Server error' });
    }
};
// export  const getUserDetails = async (req, res) => {
  

//     try {
//       const db = await getDB();
//       console.log("📦 Database connected");
  
//       const users = db.collection('users');
//       console.log("📂 Accessed 'users' collection");
  
//       const senderEmail = req.user?.email;
//       console.log("🔐 Sender email from JWT:", senderEmail);
  
//       if (!senderEmail) {
//         console.log("❌ Email not found in JWT payload");
//         return res.status(400).json({ message: 'Missing email from token' });
//       }
  
     
//       const user = await users.findOne({ email: senderEmail });
//       console.log("🔍 MongoDB user lookup result:", user);
  
//       if (!user) {
       
//         return res.status(404).json({ message: 'User not found' });
//       }
  
      
      
//       return res.status(200).json({
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         accountNo: user.accountNo,
//         accountBalance: user.accountBalance,
//         phoneNumber: user.phoneNumber,
//         role: user.role
//       });
  
//     } catch (err) {
//       console.error('🔥 Error fetching user details:', err);
//       return res.status(500).json({ message: 'Server Error' });
//     }
//   };
export default getUserData;
