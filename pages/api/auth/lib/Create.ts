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
    return  collection;
  }
  
export async function createUserNote (data: any) {

    const collection = await getCollection({
      collectionName: `user_${data.userId}`,
      db: "notes",
    });
    const result = await collection.insertOne(data); // Этот метод позволяет вставить документ в коллекцию
    return result;
  }


export async function initializeMainMenuNote(data: any) {
    const collection = await getCollection({
      collectionName: `user_nooteBook_${data.userId}`,
      db: "notes",
    });
  
    const existingDocument = await collection.findOne({});
    if (!existingDocument) {
    await collection.insertOne(data);
    }
    else {
      console.log('initialize note for main menu already exists.');
    }
  }

  export async function initializeMasterNotebook(data: any) {
    const collection = await getCollection({
      collectionName: `main_book_${data.userId}`,
      db: "notes",
    });
  
    const existingDocument = await collection.findOne({});
    if (!existingDocument) {
    await collection.insertOne(data);
    }
    else {
      console.log('initialize master notebook already exists.');
    }
  }

  export async function initializeSortingPreferences(data: any) {
    const collection = await getCollection({
      collectionName: `user_actionSorting_${data.userId}`,
      db: "notes",
    });
  
    const existingDocument = await collection.findOne({});
    if (!existingDocument) {
    await collection.insertOne(data);
    }
    else {
      console.log('initialize sorting preferences already exists.');
    }
  }
  export async function createNotebook(data: any) {
    const collection = await getCollection({
      collectionName: `user_createBook_${data.userId}`,
      db: "notes",
    });
  
    const result = await collection.insertOne({...data}); // Этот метод позволяет вставить документ в коллекцию
    return result;
  }
  