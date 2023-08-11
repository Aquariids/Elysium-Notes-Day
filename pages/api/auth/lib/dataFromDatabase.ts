import { ObjectId } from 'mongodb';
import clientPromise from './mongodb';
import { format } from 'date-fns';



const currentDate = new Date() ?? '';
export async function getAllNotesFromDatabase(userId: any,email: any) {
  const client = await clientPromise;
  try {
    const query = userId && email ? {userId, email}: {};
      const database = client.db('notes');
      const collection = database.collection(`user_${userId}`); // создаем или подключаемся к коллекции
      const data = await collection.find(query).toArray();
      return data; 
    
  } catch(error) {
    client.close();
  }
  

}


export async function getAllNotesFromDatabaseRecycle(userId: any,email: any) {
  const client = await clientPromise;
  try {
    const query = userId && email ? {userId, email}: {};
    const deeltedDb = client.db('deleted_notes');
      const collection = deeltedDb.collection(`delete_user_${userId}`); // создаем или подключаемся к коллекции
      const data = await collection.find(query).toArray();
      console.log("🚀 ~ file: dataFromDatabase.ts:32 ~ getAllNotesFromDatabaseRecycle ~ data:", data)
      return data; 
    
  } catch(error) {
    client.close();
  }
  

}
export async function createDatabase (data:any) {  
  const client = await clientPromise;
  const database = client.db('notes');
  const collection = database.collection(`user_${data.userId}`);
  const formattedDate = format(currentDate, 'yyyy-MM-dd HH:mm   :ss');
  data.date = formattedDate;
  const result = collection.insertOne(data); // Этот метод позволяет вставить документ в коллекцию
  return result;
}

export async function deleteData (_id:any, userId:any) {  
  const client = await clientPromise;
  try {
    const database = client.db('notes');
    const deeltedDb = client.db('deleted_notes');
    const collection = database.collection(`user_${userId}`);
    const id = new ObjectId(_id);
    const collectionDel = deeltedDb.collection(`delete_user_${userId}`);
    const data = await collection.find(id).toArray();
    collectionDel.insertOne({...data[0]})
    const result = await collection.deleteOne({_id:id});
    return result;
  } 
  catch(error) {
    client.close()
  }  
  
}


// В общем ту я отправляю данные на базу монго.
export async function updateDataInDatabase(data: any) {
  const client = await clientPromise;
  try {
    const id = new ObjectId(data._id)
    const database = client.db('notes');
    const collection = database.collection(`user_${data.userId}`);  
    // const formattedDate = format(currentDate, 'yyyy-MM-dd HH:mm:ss');  
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
  } catch(error) {
    client.close();
  }
 

}
  export async function updateDataTitle(data: any, ) {
    const client = await clientPromise;
    try {
      
      const id = new ObjectId(data._id)
      const database = client.db('notes');
      const collection = database.collection(`user_${data.userId}`);  
      await collection.updateOne (
        { _id: id}, 
        { $set: {
          title: data.title
        }
     }, // то обновляем тело. $set оператор обновления поля или может добавить его.
    
      );
  
    }
    catch(error) {
      console.log(error);
      client.close()
      
    }
   
    
    
 
  
}
