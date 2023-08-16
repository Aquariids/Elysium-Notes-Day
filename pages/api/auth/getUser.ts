import { MongoClient } from 'mongodb';
import clientPromise from "./lib/mongodb";
const MONGODB_URI = process.env.MONGODB_URI; // Ваша строка подключения к MongoDB
const MONGODB_DB = process.env.MONGODB_DB; // Имя базы данных

export default async function getUser() {

    async function getClient() {
  return await clientPromise;
}
const client = await getClient();

  try {
    await client.connect();
    const db = client.db('elysium');
    const usersCollection = db.collection('users'); // Имя вашей коллекции

    const user = await usersCollection.find().toArray();
    return user;
  } finally {
    client.close();
  }
}
