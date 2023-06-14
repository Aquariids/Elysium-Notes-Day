import { getDataFromDatabase } from './auth/lib/dataFromDatabase';

export default async function handler(req, res) {
    try {
        const userId = await req.query.userId;
        const data = await getDataFromDatabase(userId);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message + 'лох' });
    }
}