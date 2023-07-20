import { updateDataInDatabase } from './auth/lib/dataFromDatabase';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function POST(req:NextApiRequest, res:NextApiResponse) {
    try {
        const data = req.body;
        await updateDataInDatabase(data);
        res.status(200).send('Data updated successfully');
    } catch (error) {
        res.status(500).send('An error occurred while updating data');
    }
}


