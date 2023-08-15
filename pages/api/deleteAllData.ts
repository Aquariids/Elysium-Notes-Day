import { deleteAllData } from './auth/lib/dataFromDatabase';
import { NextApiRequest, NextApiResponse } from 'next';
interface IRequest {
    req:NextApiRequest,
    query: {
        userId:string
    }
}

export default async function handler(req:IRequest, res:NextApiResponse) {
    
    const userId = req.query.userId;
    if(!userId) {
        res.status(500).json({ message: 'Недопустимый формат идентификатора _id'});
    } else {
        await deleteAllData(userId);
        res.status(200).send('Все окей, бро');
    }
       
        
       
    
      
    
}