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
  



  export async function getAllNotesFromDatabase(userId: string | string[], email: string | string[]) {
    try {
      const query = userId && email ? { userId, email } : {};
      const collection = await getCollection({
        collectionName: `user_${userId}`,
        db: "notes",
      }) 
      const data = await collection.find(query).sort({date:1}).toArray();
      return data 
    } catch (error) {
      const client = await getClient();
      client.close();
    }
  }

  export async function getNotesFromBook(userId: string | string[], email: string | string[], idPage: any) {
    try {
      const query = userId && email ? { userId, email, idPage: idPage } : { idPage: idPage };
      const collection = await getCollection({
        collectionName: `user_${userId}`,
        db: "notes",
      }) 
      const data = await collection.find(query).sort({date:1}).toArray();
      
      return data 
    } catch (error) {
      const client = await getClient();
      client.close();
    }
  }



  export async function getAllNotesFromDatabaseRecycle(userId: string[] | string, email: string[] | string) {
    try {
      const query = userId && email ? { userId, email } : {};
      const collection = await getCollection({
        collectionName: `delete_user_${userId}`,
        db: "deleted_notes",
      });
      const data = await collection.find(query).sort({date:1}).toArray();
      return data;
     
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
      });
      const data = await collection.find(query).toArray();
      return data;
    } catch (error) {}
  }
  
  
  export async function getActionSorting(userId:string | string[] | undefined, email:string | string[] | undefined) {
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

  export async function getIdForAllBooks(userId:string | string[] | undefined, email:string | string[] | undefined,) {
    try {
      const query = userId && email ? { userId, email } : {};
      const collection = await getCollection({
        collectionName: `main_book_${userId}`,
        db: "notes",
      }); 
      const data = await collection.find(query).toArray();
      return [data[0]?.book || '', data[0]?.name || ''];
    } catch (error) {}
  }
  
  export async function getIdPageBook(userId:string | string[] | undefined, email:string | string[] | undefined) {
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
  