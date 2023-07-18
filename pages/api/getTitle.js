import { getTitleFromDatabase } from './auth/lib/dataFromDatabase';

export default async function handler(req, res) {
    try {
        const _id = req.query._id
        const data = await getTitleFromDatabase(_id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
}