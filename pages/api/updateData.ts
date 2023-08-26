import { Action, update_action } from "./actios";
import {
  updateDataInDatabase,
  updateDataTitle,
  updateNoteBookMainMenu,
} from "./auth/lib/dataFromDatabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  const action: Action = req.query.action as Action;
  try {
    const data = req.body;
    switch (action) {
      case update_action.editor:
        await updateDataInDatabase(data); 
        console.log(
'1'
        );
              
        res.status(200).send("Data editor updated successfully");
        break;
      case update_action.editor_title:
        console.log('2');
        await updateDataTitle(data);
        res.status(200).send("Data title updated successfully");
        break;
      case update_action.book_main_menu:
        await updateNoteBookMainMenu(data);
        console.log(
            '3'
                    );
        res.status(200).send("Data bookMainMenu updated successfully");
        break;
      default:
        res.status(400).send("Invalid action");
        return;
    }

  } catch (error) {
    res.status(500).send("An error occurred while updating data");
  }
}
