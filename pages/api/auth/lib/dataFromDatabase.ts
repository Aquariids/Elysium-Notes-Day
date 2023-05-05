import clientPromise from './mongodb';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';


export async function getDataFromDatabase(userId: any) {

  const client = await clientPromise;
  const database = client.db('notes');
  const collection = database.collection('chek');
  const query = userId ? { userId } : {};
  const data = await collection.find(query).toArray();
  console.log("(👍≖‿‿≖)👍 ✿ file: dataFromDatabase.ts:23 ✿ getDataFromDatabase ✿  data[0].body:", data[0].body)

  // Преобразование сырого объекта в редактируемый контент
  const contentState = convertFromRaw(data[0].body);
  // const text = contentState.getPlainText();
  // Получение текста из редактируемого контента
  // const text = contentState.getPlainText();

  // const newEditorState = EditorState.createWithContent(contentState);

  return data[0].body;
}




// В общем ту тя отправляю данные на базу моного.
export async function updateDataInDatabase(data: any) {
  const options = { upsert: true };
  const client = await clientPromise;
  const database = client.db('notes');
  const collection = database.collection('chek');
  // Сохранение сырого содержимого в базе данных - это объект состояния редактора draft js
  // Этот объект мы можем получить с помощью converToRaw который принимает объект ContentState и возвращает нам сырой объект.
  // такой объект можно где то сохранить в базе данные или еще где то. В общем для хранения данные.
  await collection.updateOne(
    { $and: [{ email: data.email }, { userId: data.userId }] },
    { $set: { body: data.body } },
    options
  );
}
