import { createDatabase } from './auth/lib/dataFromDatabase';

export default async function handler(req, res) {
    try {
        const data = req.body;
        await createDatabase(data);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send('An error occurred while updating data');
    }
}
