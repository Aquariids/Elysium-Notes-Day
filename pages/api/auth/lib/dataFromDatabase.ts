import clientPromise from './mongodb';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';


export async function getDataFromDatabase(userId: any) {
  const client = await clientPromise;
  const database = client.db('notes2');
  const collection = database.collection('page2');
  const query = userId ? { userId } : {};
  const data = await collection.find(query).toArray();
  const [body] = data;

  return body.body; // получаю пока что только тело, то есть данные из редактора draft js

}

export async function getId(userId: any) {
  const client = await clientPromise;
  const database = client.db('notes2');
  const collection = database.collection('page2');
  const query = userId ? { userId } : {};
  const data = await collection.find(query).toArray();
  const [body] = data;
  
  
  
  return body._id; 

}


export async function createDatabase (data:any) {
  const client = await clientPromise;
  const database = client.db('notes2');
  const collection = database.collection('page2');
  const result = await collection.insertOne(data); // Этот метод позволяет вставить документ в коллекцию
  return result;
  


}



// В общем ту я отправляю данные на базу монго.
export async function updateDataInDatabase(data: any) {
  const options = { upsert: true };
  const client = await clientPromise;
  const database = client.db('notes2');
  const collection = database.collection('page2');
  // Сохранение сырого содержимого в базе данных - это объект состояния редактора draft js
  // Этот объект мы можем получить с помощью converToRaw который принимает объект ContentState и возвращает нам сырой объект.
  // такой объект можно где то сохранить в базе данные или еще где то. В общем для хранения данные.
  await collection.updateOne(
    { $and: [{ email: data.email }, { userId: data.userId }] },
    { $set: { body: data.body } },
    options
  );
}
