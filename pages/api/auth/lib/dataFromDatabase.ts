import clientPromise from './mongodb';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';


export async function getDataFromDatabase(userId: any) {
  const client = await clientPromise;
  const database = client.db('notes');
  const collection = database.collection('page');
  const query = userId ? { userId } : {};
  const data = await collection.find(query).toArray();
  const [body] = data;

  return body.body; // получаю пока что только тело, то есть данные из редактора draft js

}



// В общем ту я отправляю данные на базу моного.
export async function updateDataInDatabase(data: any) {
  const options = { upsert: true };
  const client = await clientPromise;
  const database = client.db('notes');
  const collection = database.collection('page');
  // Сохранение сырого содержимого в базе данных - это объект состояния редактора draft js
  // Этот объект мы можем получить с помощью converToRaw который принимает объект ContentState и возвращает нам сырой объект.
  // такой объект можно где то сохранить в базе данные или еще где то. В общем для хранения данные.
  await collection.updateOne(
    { $and: [{ email: data.email }, { userId: data.userId }] },
    { $set: { body: data.body } },
    options
  );
}
