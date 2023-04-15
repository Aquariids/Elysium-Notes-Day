import { updateDataInDatabase } from './auth/lib/dataFromDatabase';

export default async function handler(req, res) {
    try {
        const data = req.body;
        await updateDataInDatabase(data);
        res.status(200).send('Data updated successfully');
    } catch (error) {
        res.status(500).send('An error occurred while updating data');
    }
}