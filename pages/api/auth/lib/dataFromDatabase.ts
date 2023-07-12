import { ObjectId } from 'mongodb';
import clientPromise from './mongodb';

export async function getDataFromDatabase(_id: any) {
  const client = await clientPromise;
  const database = client.db('notes2');
  const collection = database.collection('page2');
  const id =  new ObjectId(_id)
  const data = await collection.find(id).toArray();
  const [body] = data;

  return body.body; // получаю пока что только тело, то есть данные из редактора draft js

}


export async function getAllNotesFromDatabase(userId: any,email: any) {
  const query = userId && email ? {userId, email}: {};
  const client = await clientPromise;
  const database = client.db('notes2');
  const collection = database.collection('page2');
  const data = await collection.find(query).toArray();
  
  return data; 

}

export async function createDatabase (data:any) {
  const client = await clientPromise;
  const database = client.db('notes2');
  const collection = database.collection('page2');
  const result =  collection.insertOne(data); // Этот метод позволяет вставить документ в коллекцию
  return result;
}

export async function deleteData (_id:any) {
  const client = await clientPromise;
  const database = client.db('notes2');
  const collection = database.collection('page2');
  const id = new ObjectId(_id)
  const result = await collection.deleteOne({_id:id}); // Этот метод позволяет вставить документ в коллекцию
  return result;
}


// В общем ту я отправляю данные на базу монго.
export async function updateDataInDatabase(data: any) {
  const id =  new ObjectId(data._id)
  const client = await clientPromise;
  const database = client.db('notes2');
  const collection = database.collection('page2');  
  // Сохранение сырого содержимого в базе данных - это объект состояния редактора draft js
  // Этот объект мы можем получить с помощью converToRaw который принимает объект ContentState и возвращает нам сырой объект.
  // такой объект можно где то сохранить в базе данные или еще где то. В общем для хранения данные.
  await collection.findOneAndUpdate (
    //$and - объеденяет выражение и возрвращает документы подходящие под условие. типо тоже самое что логическое &&
    {  $and: [ {userId:data.userId}, {email:data.email}, {_id: id}]}, // фильтрация - проверяем если email равен data.email и userId равен data.userId
    { $set: { body: data.body } }, // то обновляем тело. $set оператор обновления поля или может добавить его.

  );

  
}
