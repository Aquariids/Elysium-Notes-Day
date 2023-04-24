import { getDataFromDatabase } from './auth/lib/dataFromDatabase';

export default async function handler(req, res) {
    const userId = req.query.userId;
    const data = await getDataFromDatabase(userId);
    res.status(200).json(data);
}