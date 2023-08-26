import { updateNoteBookMainMenu } from './auth/lib/dataFromDatabase';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    try {
        
        const data = req.body;
        console.log("🚀 ~ file: updateNoteBook.ts:8 ~ handler ~ data:", data)
        await updateNoteBookMainMenu(data);
        res.status(200).send('Data updated successfully');
    } catch (error) {
        res.status(500).send('An error occurred while updating data');
    }
}


