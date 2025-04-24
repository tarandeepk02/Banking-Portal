
import express from 'express';
import {connection, getDB} from './database.js'
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import router from './routes/userRoutes.js';
import  setupCollections from './collections.js'

dotenv.config(); 


//   .then(async () => {
//     const db = await getDB();  
//     await setupCollections(db);  

//     console.log(" Database collections set up successfully!");

//     // Start the server after collections are set up
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//     });
//   })





dotenv.config(); // ✅ Load env vars

const app = express();
const PORT = process.env.PORT || 5000;

// For __dirname with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Middleware
app.use(express.json());
console.log('✅ JSON middleware enabled');

// ✅ API routes
console.log('✅ Registering /api/users routes');
app.use('/api/users', router);
app.use('/api/admin', router);

// ✅ Test route (for debugging)
app.get('/test', (req, res) => {
  console.log('✅ /test hit');
  res.send('Test route working!');
});

// ✅ Serve frontend (if you're building with Parcel into public/)
app.use(express.static(path.join(__dirname, 'public')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

connection
  .then(async () => {
    const db = await getDB();  
    await setupCollections(db);  

    console.log(" Database collections set up successfully!");

    // Start the server after collections are set up
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })