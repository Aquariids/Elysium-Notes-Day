import clientPromise from './mongodb';

export async function getDataFromDatabase() {
  const client = await clientPromise
  const database = client.db('notes')
  const collection = database.collection('chek')
  const data = await collection.find({}).toArray()
  return data
}

export async function updateDataInDatabase(data:any) {
  const options = { upsert: true };
  const client = await clientPromise
  const database = client.db('notes')
  const collection = database.collection('chek')
  await collection.updateOne({ _id: data._id }, { $set: {email:data.email} }, options);
}