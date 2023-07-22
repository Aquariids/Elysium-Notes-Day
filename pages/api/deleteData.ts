import { deleteData } from './auth/lib/dataFromDatabase';
import { NextApiRequest, NextApiResponse } from 'next';
interface IRequest {
    req:NextApiRequest,
    query: {
        _id: string
        userId:string
    }
}

export default async function handler(req:IRequest, res:NextApiResponse) {
    
    const _id = req.query._id;
    const userId = req.query.userId;
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(_id); // проверка на то, что _id mongodb в корректном формате
    if(!isValidObjectId) {
        res.status(500).json({ message: 'Недопустимый формат идентификатора _id'});
    } else {
        await deleteData(_id, userId);
        res.status(200).send('Все окей, бро');
    }
       
        
       
    
      
    
}