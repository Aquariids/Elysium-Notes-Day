import { ObjectId } from "mongodb";
import clientPromise from "./mongodb";
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

export async function updateIdPageForNote(data: any) {

  const dataConfirm = data[0] && data[0]
  try {
    const collection = await getCollection({
      collectionName: `user_createBook_${dataConfirm.userId}`,
      db: "notes",
    });
    await collection.findOneAndUpdate(
      { $and: [{ userId: dataConfirm.userId }, { email: dataConfirm.email }] }, 
      {
        $set: {
          idPage: dataConfirm.idPage,
        },
      } 
    );
  } catch (error) {
    const client = await getClient();
    client.close();
  }
}






export async function updateIdPageForOneNote(data: any) {

  try {
    const id = new ObjectId(data._id);
    const collection = await getCollection({
      collectionName: `user_${data.userId}`,
      db: "notes",
    });
    await collection.findOneAndUpdate(
      { $and: [{ userId: data.userId }, { email: data.email }, {_id: id}] }, 
      {
        $set: {
          idPage: data.idPage,
        },
      } 
    );
  } catch (error) {
    const client = await getClient();
    client.close();
  }
}


export async function deleteIdPageForNote(data: any) {
  try {

    const collection = await getCollection({
      collectionName: `user_${data.userId}`,
      db: "notes",
    });
    await collection.updateMany(
      { $and: [{ userId: data.userId }, { email: data.email }] }, 
      {
        $set: {
          idPage: '',
        },
      } 
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
          title: data.title || ''
        }
      } // то обновляем тело. $set оператор обновления поля или может добавить его.
    );
  } catch (error) {
    const client = await getClient();
    client.close();
  }
}


export async function updateBlockLink(data: any) {
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
          block: data.block,
        },
      } 
    );
  } catch (error) {
    const client = await getClient();
    client.close();
  }
}

export async function updateModeCode(data: any) {  
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
          code: data.code,
        },
      } 
    );
  } catch (error) {
    const client = await getClient();
    client.close();
  }
}


export async function updateLastDate(data: any) {  
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
          updateDate: data.updateDate ?? '',
        },
      } 
    );
  } catch (error) {
    const client = await getClient();
    client.close();
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


export async function updateActionSorting(data: any) {
  try {
    const collection = await getCollection({
      collectionName: `user_actionSorting_${data.userId}`,
      db: "notes",
    });
    await collection.updateOne(
      { userId: data.userId },
      {
        $set: {
          sorting: data.sorting,
        },
      } // то обновляем тело. $set оператор обновления поля или может добавить его.
    );
  } catch (error) {
    const client = await getClient();
    client.close();
  }
}



export async function updateBookForNotes(data: any) {
console.log("🚀 ~ file: Update.ts:255 ~ updateBookForNotes ~ data:", data)

  try {
    const collection = await getCollection({
      collectionName: `main_book_${data.userId}`,
      db: "notes",
    });

    if(data.book) {
      await collection.updateOne(
        { userId: data.userId, email:data.email },
        {
          $set: {
          book: data.book,
          },
        } 
      );
    }
    if(data.name) {
        await collection.updateOne(
          { userId: data.userId, email:data.email },
          {
            $set: {
              name: data.name,
            },
          } 
        );
    }
    
  } catch (error) {
    const client = await getClient();
    client.close();
  }
}


