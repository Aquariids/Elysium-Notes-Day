import { CreateAction } from './actios';
import { createDatabase, createNoteBookMainMenu } from './auth/lib/dataFromDatabase';
import { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    const action:CreateAction = req.query.action as CreateAction;
    const data = req.body;
    try {
        if(data) {
            switch(action) {
                case 'create_data':
                    await createDatabase(data);
                    res.status(200).json(data);
                break;
                
                case 'create_data_main_menu':
                    await createNoteBookMainMenu(data);
                    res.status(200).json(data);
                break;
            }
        } else {
            res.status(500).send('An error occurred while create data');
        }
     
    } catch (error) {
        res.status(500).send('An error occurred while create data');
    }
}
