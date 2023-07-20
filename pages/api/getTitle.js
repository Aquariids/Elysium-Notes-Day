import { getTitleFromDatabase } from './auth/lib/dataFromDatabase';

export default async function handler(req, res) {
 
        const _id = req.query._id

        if(!_id) {
            res.status(500).json("Такого заголовка нет");
        } else {
            const data = await getTitleFromDatabase(_id);
            res.status(200).json(data);
        }
   

}