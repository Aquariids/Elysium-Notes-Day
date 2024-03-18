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

export async function getAllUserNotes(
  userId: string | string[],
  email: string | string[],
  withoutId: boolean
) {
 
  
  const query = userId && email ? { userId, email } : {};

  try {
    const collection = await getCollection({
      collectionName: `user_${userId}`,
      db: "notes",
    });
    const allNotes = await collection.find(query).sort({ date: 1 }).toArray();
    const notesWithoutIdPage = allNotes.filter((item) => {
      return !item.idPage;
    });

    if(withoutId) {
      return notesWithoutIdPage
    } else {
      return allNotes;
    }
    
  
  } catch (error) {
    const client = await getClient();
    client.close();
  }
}

export async function getAllUserNotesWithoutId(
  userId: string | string[],
  email: string | string[],
) {
 
  
  const query = userId && email ? { userId, email } : {};

  try {
    const collection = await getCollection({
      collectionName: `user_${userId}`,
      db: "notes",
    });
    const allNotes = await collection.find(query).sort({ date: 1 }).toArray();
    const notesWithoutIdPage = allNotes.filter((item) => {
      return !item.idPage;
    });
      return notesWithoutIdPage;
  
  } catch (error) {
    const client = await getClient();
    client.close();
  }
}
export async function getUserNotesFromNotebook(
  userId: string | string[],
  email: string | string[],
  idPage: any
) {
  try {
    const query =
      userId && email ? { userId, email, idPage: idPage } : { idPage: idPage };
    const collection = await getCollection({
      collectionName: `user_${userId}`,
      db: "notes",
    });
    const data = await collection.find(query).sort({ date: 1 }).toArray();

    return data;
  } catch (error) {
    const client = await getClient();
    client.close();
  }
}

export async function getAllUserNotesFromRecycle(
  userId: string[] | string,
  email: string[] | string
) {
  try {
    const query = userId && email ? { userId, email } : {};
    const collection = await getCollection({
      collectionName: `delete_user_${userId}`,
      db: "deleted_notes",
    });
    const data = await collection.find(query).sort({ date: 1 }).toArray();
    return data;
  } catch (error) {
    const client = await getClient();
    client.close();
  }
}

export async function getMainMenuNote(
  userId: string | string[] | undefined,
  email: string | string[] | undefined
) {
  try {
    const query = userId && email ? { userId, email } : {};
    const collection = await getCollection({
      collectionName: `user_nooteBook_${userId}`,
      db: "notes",
    });
    const data = await collection.find(query).toArray();
    return data;
  } catch (error) {}
}

export async function getSortingPreferences(
  userId: string | string[] | undefined,
  email: string | string[] | undefined
) {
  try {
    const query = userId && email ? { userId, email } : {};
    const collection = await getCollection({
      collectionName: `user_actionSorting_${userId}`,
      db: "notes",
    });
    const data = await collection.find(query).toArray();
    return data;
  } catch (error) {}
}

export async function getActiveNotebook(
  userId: string | string[] | undefined,
  email: string | string[] | undefined
) {
  try {
    const query = userId && email ? { userId, email } : {};
    const collection = await getCollection({
      collectionName: `main_book_${userId}`,
      db: "notes",
    });
    const data = await collection.find(query).toArray();

    return [data[0]?.book || "", data[0]?.name || ""];
  } catch (error) {}
}

export async function getActiveNotebookWithoutId(
  userId: string | string[] | undefined,
  email: string | string[] | undefined
) {
  try {
    const query = userId && email ? { userId, email } : {};
    const collection = await getCollection({
      collectionName: `main_book_${userId}`,
      db: "notes",
    });
    const data = await collection.find(query).toArray();

    return [data[0]?.withoutId];
  } catch (error) {}
}

export async function getAllUserNotebook(
  userId: string | string[] | undefined,
  email: string | string[] | undefined
) {
  try {
    const query = userId && email ? { userId, email } : {};
    const collection = await getCollection({
      collectionName: `user_createBook_${userId}`,
      db: "notes",
    }); // создаем или подключаемся к коллекции
    const data = await collection.find(query).toArray();
    return data;
  } catch (error) {}
}
