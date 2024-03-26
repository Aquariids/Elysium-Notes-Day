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
    return collection;
  }
  

// В общем ту я отправляю данные на базу монго.
export async function updateNoteContent(data: any) {

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
          body: data.body
        },
      } // то обновляем тело. $set оператор обновления поля или может добавить его.
    );
  } catch (error) {
    const client = await getClient();
    client.close();
  }
}

export async function updateNoteDeletionDate(data: any) {
  
    try {
      const id = new ObjectId(data._id);
      const collection = await getCollection({
        collectionName: `user_${data.userId}`,
        db: "notes",
      });
      
      await collection.findOneAndUpdate(
      
        { $and: [{ userId: data.userId }, { email: data.email }, { _id: id }] }, 
        {
          $set: {
            deleteDate: data.deleteDate
          },
        } 
      );
    } catch (error) {
      const client = await getClient();
      client.close();
    }
  }
  



export async function updateNotebookIdForNote(data: any) {

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




export async function updateNoteTitle(data: any) {


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


export async function updateNoteVisibility(data: any) {
  
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

export async function updateCodeHighlighting (data: any) {  
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


export async function updateNoteLastModifiedDate(data: any) {  
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


export async function updateMainMenuNote(data: any) {
  
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


export async function updateSortingPreferences(data: any) {
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



export async function updateActiveNotebook(data: any) {
  
  try {
    const collection = await getCollection({
      collectionName: `main_book_${data.userId}`,
      db: "notes",
    });
      await collection.updateOne(
        { userId: data.userId, email:data.email },
        {
          $set: {
          book: data.book,
          },
        } 
      );
    
  } catch (error) {
    const client = await getClient();
    client.close();
  }
}

export async function updateActiveNotebookWithoutId(data: any) {
  
  try {
    const collection = await getCollection({
      collectionName: `main_book_${data.userId}`,
      db: "notes",
    });
      await collection.updateOne(
        { userId: data.userId, email:data.email },
        {
          $set: {
          withoutId: data?.withoutId

          },
        } 
      );
    
  } catch (error) {
    const client = await getClient();
    client.close();
  }
}


