import { getAllNotesFromDatabase } from './auth/lib/dataFromDatabase';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function GET(req:NextApiRequest, res:NextApiResponse) {
    const userId = req.query.userId;
    const email = req.query.email;

    if(!userId && !email) {
        res.status(500).json(" Вернитесь на главную страницу и авторизуйтесь, пожалуйста. ");
    }
    else {
        const data = await getAllNotesFromDatabase(userId,email);
        res.status(200).json(data);
    }
   
       
   
}