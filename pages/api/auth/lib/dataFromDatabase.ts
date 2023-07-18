import { ObjectId } from 'mongodb';
import clientPromise from './mongodb';

// export async function getTitleFromDatabase(userId: any ,email:any) {
//   const client = await clientPromise;
//   const database = client.db('notes2');
//   const collection = database.collection('page2');
//   const query = userId && email ? {userId, email}: {};
//   const title = await collection.find()
//   console.log("🚀 ~ file: dataFromDatabase.ts:10 ~ getTitleFromDatabase ~ title:", title.title)
  
  

//   return title && title.title; 

// }


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
  const result = await collection.deleteOne({_id:id});
  return result;
}


// В общем ту я отправляю данные на базу монго.
export async function updateDataInDatabase(data: any) {
  const id = new ObjectId(data._id)
  const client = await clientPromise;
  const database = client.db('notes2');
  const collection = database.collection('page2');  
  // Сохранение сырого содержимого в базе данных - это объект состояния редактора draft js
  // Этот объект мы можем получить с помощью converToRaw который принимает объект ContentState и возвращает нам сырой объект.
  // такой объект можно где то сохранить в базе данные или еще где то. В общем для хранения данные.
  await collection.findOneAndUpdate (
    //$and - объеденяет выражение и возрвращает документы подходящие под условие. типо тоже самое что логическое &&
    {  $and: [ {userId:data.userId}, {email:data.email}, {_id: id}]}, // фильтрация - проверяем если email равен data.email и userId равен data.userId
    { $set: {
      body: data.body,
    }
 }, // то обновляем тело. $set оператор обновления поля или может добавить его.

  );

}
  export async function updateDataTitle(data: any) {
    console.log("🚀 ~ file: dataFromDatabase.ts:69 ~ updateDataTitle ~ data:", data)
    const id = new ObjectId(data._id)
    const client = await clientPromise;
    const database = client.db('notes2');
    const collection = database.collection('page2');  
    await collection.updateOne (
      { _id: id}, 
      { $set: {
        title: data.title
      }
   }, // то обновляем тело. $set оператор обновления поля или может добавить его.
  
    );

  
}
