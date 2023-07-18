import { deleteData } from './auth/lib/dataFromDatabase';

export default async function handler(req, res) {
    try {
        const _id = req.query._id;
        await deleteData(_id);
        res.status(200).send('Все окей, бро');
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
}