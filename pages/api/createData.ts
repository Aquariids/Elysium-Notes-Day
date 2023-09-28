import { CreateAction } from './actios';
import { NextApiRequest, NextApiResponse } from 'next';
import { createBook, createDatabase, createNoteBookMainMenu, createSortingDocument } from './auth/lib/Create';
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
                case 'create_data_sorting':
                    await createSortingDocument(data);
                    res.status(200).json(data);
                break;
                case 'create_book':
                    await createBook(data);
                    res.status(200).json(data);
                break;
                default:
                    res.status(400).send("Invalid action");
          return;
                
            }
        } else {
            res.status(500).send('An error occurred while create data');
        }
     
    } catch (error) {
        res.status(500).send('An error occurred while create data');
    }
}
