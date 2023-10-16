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
  



export async function createDatabase(data: any) {

    const collection = await getCollection({
      collectionName: `user_${data.userId}`,
      db: "notes",
    });
    const result = await collection.insertOne(data); // Этот метод позволяет вставить документ в коллекцию
    return result;
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
      console.log('Document note for main menu already exists.');
    }
  }

  export async function createBookForAllNotes(data: any) {
    const collection = await getCollection({
      collectionName: `main_book_${data.userId}`,
      db: "notes",
    });
  
    const existingDocument = await collection.findOne({});
    if (!existingDocument) {
    await collection.insertOne(data);
    }
    else {
      console.log('Document Book already exists.');
    }
  }

  export async function createSortingDocument(data: any) {
    const collection = await getCollection({
      collectionName: `user_actionSorting_${data.userId}`,
      db: "notes",
    });
  
    const existingDocument = await collection.findOne({});
    if (!existingDocument) {
    await collection.insertOne(data);
    }
    else {
      console.log('Document sorting already exists.');
    }
  }
  export async function createBook(data: any) {
    const collection = await getCollection({
      collectionName: `user_createBook_${data.userId}`,
      db: "notes",
    });
  
    const result = await collection.insertOne({...data}); // Этот метод позволяет вставить документ в коллекцию
    return result;
  }
  