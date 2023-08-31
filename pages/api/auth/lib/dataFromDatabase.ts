import { ObjectId } from "mongodb";
import clientPromise from "./mongodb";
import { format } from "date-fns";
import ru from "date-fns/locale/ru";

interface dbPros {
  collectionName: string;
  db: string;
}

async function getClient() {
  return await clientPromise;
}


async function getCollection({ db, collectionName }: dbPros) {
  const client = await getClient();
  const database = client.db(db);
  const collection = database.collection(collectionName);
  return await collection;
}

const currentDate = new Date() ?? "";
export async function getAllNotesFromDatabase(userId: string | string[], email: string | string[],sort:string | string[] | undefined) {
  try {
    const query = userId && email ? { userId, email } : {};
    const collection = await getCollection({
      collectionName: `user_${userId}`,
      db: "notes",
    }); // создаем или подключаемся к коллекции
    const data = await collection.find(query).toArray();
    const dataDate = sort === 'date' ? data.sort((a, b) => a.title.localeCompare(b.date)) :data
    return dataDate;
  } catch (error) {
    const client = await getClient();
    client.close();
  }
}

export async function getAllNotesFromDatabaseRecycle(userId: any, email: any) {
  try {
    const query = userId && email ? { userId, email } : {};
    const collection = await getCollection({
      collectionName: `delete_user_${userId}`,
      db: "deleted_notes",
    }); // создаем или подключаемся к коллекции
    const data = await collection.find(query).toArray();
    return data;
  } catch (error) {
    const client = await getClient();
    client.close();
  }
}
export async function createDatabase(data: any) {
  const collection = await getCollection({
    collectionName: `user_${data.userId}`,
    db: "notes",
  });
  const formattedDate = format(currentDate, "EEEE, d MMMM yyyy HH:mm",{ locale: ru });
  data.date = formattedDate;
  const result = collection.insertOne(data); // Этот метод позволяет вставить документ в коллекцию
  return result;
}

export async function deleteDataRecycle(_id: any, userId: any) {
  try {
    const id = new ObjectId(_id);
    const collection = await getCollection({
      collectionName: `user_${userId}`,
      db: "notes",
    });
    const collectionDel = await getCollection({
      collectionName: `delete_user_${userId}`,
      db: "deleted_notes",
    });
    const data = await collection.find(id).toArray();
    collectionDel.insertOne({ ...data[0] });
    const result = await collection.deleteOne({ _id: id });
    return result;
  } catch (error) {
    const client = await getClient();
    client.close();
  }
}

export async function restoreDataRecycle(_id: any, userId: any) {
  try{
    const id = new ObjectId(_id);
    const collectionDel = await getCollection({
      collectionName: `delete_user_${userId}`,
      db: "deleted_notes",
    });
    const collection = await getCollection({
      collectionName: `user_${userId}`,
      db: "notes",
    });
    const data = await collectionDel.find(id).toArray();
    collection.insertOne({ ...data[0] });
    const result = await collectionDel.deleteOne({ _id: id });
    return result;
  }

  catch {
    const client = await getClient();
    client.close();
  }
}

export async function deleteData(_id: any, userId: any) {
  try {
    const id = new ObjectId(_id);
    const collection = await getCollection({
      collectionName: `delete_user_${userId}`,
      db: "deleted_notes",
    });
    const result = await collection.deleteOne({ _id: id });
    return result;
  } catch (error) {
    const client = await getClient();
    client.close();
  }
}

export async function deleteAllData(userId: any) {
  try {
    const collection = await getCollection({
      collectionName: `delete_user_${userId}`,
      db: "deleted_notes",
    });
    const result = await collection.deleteMany({});
    return result;
  } catch (error) {
    const client = await getClient();
    client.close();
  }
}

// В общем ту я отправляю данные на базу монго.
export async function updateDataInDatabase(data: any) {
  try {
    const id = new ObjectId(data._id);
    const collection = await getCollection({
      collectionName: `user_${data.userId}`,
      db: "notes",
    });
    // const formattedDate = format(currentDate, 'yyyy-MM-dd HH:mm:ss');
    // Сохранение сырого содержимого в базе данных - это объект состояния редактора draft js
    // Этот объект мы можем получить с помощью converToRaw который принимает объект ContentState и возвращает нам сырой объект.
    // такой объект можно где то сохранить в базе данные или еще где то. В общем для хранения данные.
    await collection.findOneAndUpdate(
      //$and - объеденяет выражение и возрвращает документы подходящие под условие. типо тоже самое что логическое &&
      { $and: [{ userId: data.userId }, { email: data.email }, { _id: id }] }, // фильтрация - проверяем если email равен data.email и userId равен data.userId
      {
        $set: {
          body: data.body,
        },
      } // то обновляем тело. $set оператор обновления поля или может добавить его.
    );
  } catch (error) {
    const client = await getClient();
    client.close();
  }
}
export async function updateDataTitle(data: any) {
  try {
    const id = new ObjectId(data._id);
    const collection = await getCollection({
      collectionName: `user_${data.userId}`,
      db: "notes",
    });
    await collection.updateOne(
      { _id: id },
      {
        $set: {
          title: data.title,
        },
      } // то обновляем тело. $set оператор обновления поля или может добавить его.
    );
  } catch (error) {
    const client = await getClient();
    client.close();
  }
}


export async function updateBlockLink(data: any) {
  try {
    console.log(data.block);
    
    const id = new ObjectId(data._id);
    const collection = await getCollection({
      collectionName: `user_${data.userId}`,
      db: "notes",
    });
    await collection.updateOne(
      { _id: id },
      {
        $set: {
          block: data.block,
        },
      } // то обновляем тело. $set оператор обновления поля или может добавить его.
    );
  } catch (error) {
    const client = await getClient();
    client.close();
  }
}

export async function getNoteBookMainMenu(userId:string | string[] | undefined, email:string | string[] | undefined) {
  try {
    const query = userId && email ? { userId, email } : {};
    const collection = await getCollection({
      collectionName: `user_nooteBook_${userId}`,
      db: "notes",
    }); // создаем или подключаемся к коллекции
    const data = await collection.find(query).toArray();
    return data;
  } catch (error) {}
}


export async function createNoteBookMainMenu(data: any) {
  const collection = await getCollection({
    collectionName: `user_nooteBook_${data.userId}`,
    db: "notes",
  });

  const existingDocument = await collection.findOne({});
  if (!existingDocument) {
  await collection.insertOne(data);
  }
  else {
    console.log('Document already exists.');
  }
}



export async function updateNoteBookMainMenu(data: any) {
  try {
    const collection = await getCollection({
      collectionName: `user_nooteBook_${data.userId}`,
      db: "notes",
    });
    await collection.updateOne(
      { userId: data.userId },
      {
        $set: {
          body: data.body,
        },
      } // то обновляем тело. $set оператор обновления поля или может добавить его.
    );
  } catch (error) {
    const client = await getClient();
    client.close();
  }
}

