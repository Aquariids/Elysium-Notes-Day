import { getAllNotesFromDatabase } from './auth/lib/dataFromDatabase';

export default async function handler(req, res) {
    const userId = req.query.userId;
    const email = req.query.email;


 
    if(!userId && !email) {
        res.status(500).json("иди отсюда");
    }
    else {
        const data = await getAllNotesFromDatabase(userId,email);
        res.status(200).json(data);
    }
   
       
   
}