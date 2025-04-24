import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db = null;

// Graceful shutdown
process.on('SIGINT', async () => {
  await client.close();
  console.log("❌ Closed MongoDB connection");
  process.exit(0);
});

// Connect to MongoDB and export the DB
const connection = client.connect()
  .then(() => {
    db = client.db('bankingportal');
    console.log("✅ MongoDB connected");
  })
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err);
  });

const getDB = async () => {
  if (!db) {
    await connection; // Ensure connection is complete before returning db
  }
  return db;
};

export { connection, getDB };
