import clientPromise from './mongodb';

export async function getDataFromDatabase(userId:any) {  
  const client = await clientPromise;
  const database = client.db('notes');
  const collection = database.collection('chek');
  const query = userId ? { userId } : {};
  const data = await collection.find(query).toArray();    
  return data;
}

export async function updateDataInDatabase(data: any) {
  const options = { upsert: true };
  const client = await clientPromise;
  const database = client.db('notes');
  const collection = database.collection('chek');
  await collection.updateOne({ userId: data.userId }, { $set: { body: data.body, email: data.email } }, options);
}