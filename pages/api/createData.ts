import { CreateAction, create_data_action } from './actions';
import { NextApiRequest, NextApiResponse } from 'next';
import { createNotebook, initializeMasterNotebook, createUserNote , initializeMainMenuNote, initializeSortingPreferences } from './auth/lib/Create';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    const action:CreateAction = req.query.action as CreateAction;
    const session = await getServerSession(req, res, authOptions);
    const data = req.body;
    try {
        if(data && session) {
            switch(action) {
                case create_data_action.create_user_note:
                    await createUserNote (data);
                    res.status(200).json(data);
                break;
                case create_data_action.initialize_main_menu_note:
                    await initializeMainMenuNote(data);
                    res.status(200).json(data);
                break;
                case create_data_action.initialize_sorting_preferences:
                    await initializeSortingPreferences(data);
                    res.status(200).json(data);
                break;
                case create_data_action.create_notebook:
                    await createNotebook(data);
                    res.status(200).json(data);
                break;
                case create_data_action.initialize_master_notebook:
                    await initializeMasterNotebook(data);
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
