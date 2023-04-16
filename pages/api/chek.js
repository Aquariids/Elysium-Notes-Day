import { getDataFromDatabase } from './auth/lib/dataFromDatabase';

export default async function handler(req, res) {
    const email = req.query.email;
    const data = await getDataFromDatabase(email);
    res.status(200).json(data);
}