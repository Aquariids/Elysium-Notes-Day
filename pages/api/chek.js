import { getDataFromDatabase } from './auth/lib/dataFromDatabase';

export default async function handler(req, res) {
    const data = await getDataFromDatabase()
    res.status(200).json(data)
}