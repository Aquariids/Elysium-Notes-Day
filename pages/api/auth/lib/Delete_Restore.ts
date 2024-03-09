import { ObjectId } from "mongodb";
import clientPromise from "./mongodb";
import { DateTime, Settings } from "luxon";
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




export async function deleteDataRecycle(_id: string, userId: string) {
 
  
   
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
  
  export async function restoreDataRecycle(_id: string, userId: string) {
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
  export async function deleteData(_id: string, userId: string) {
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
  export async function deleteIdPageBook(_id: string, userId: string) {
    try {
      const id = new ObjectId(_id);
      const collection = await getCollection({
        collectionName: `user_createBook_${userId}`,
        db: "notes",
      });
      const result = await collection.deleteOne({ _id: id });
  
      return result;
    } catch (error) {
      const client = await getClient();
      client.close();
    }
  }

  export async function removeNotebookIdFromNote(data: any) {

    try {
  console.log(data);
  
      const collection = await getCollection({
        collectionName: `user_${data.userId}`,
        db: "notes",
      });
      
       
          await collection.updateMany(
            { $and: [{ userId: data.userId }, { email: data.email }, {idPage: data.idPage}] }, 
            {
              $set: {
                idPage: ''
              },
            } 
          );
        
    
    } catch (error) {
      const client = await getClient();
      client.close();
    }
  }
  
  

  export async function deleteAllData(userId: string) {
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
  