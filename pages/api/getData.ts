import { GetAction, get_action } from "./actios";
import {
  getActionSorting,
  getAllNotesFromDatabase,
  getAllNotesFromDatabaseRecycle,
  getIdPageBook,
  getNoteBookMainMenu,
} from "./auth/lib/dataFromDatabase";
import { NextApiRequest, NextApiResponse } from "next";


export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.query.userId;
  const email = req.query.email;
  console.log("🚀 ~ file: getData.ts:15 ~ GET ~ email:", email)
  const action: GetAction = req.query.action as GetAction;
  try {
    if (userId && email) {
      switch (action) {
        case get_action.data_editor:
          res.status(200).json(await getAllNotesFromDatabase(userId, email));
          break;
        case get_action.data_recycle:
          res.status(200).json(await getAllNotesFromDatabaseRecycle(userId, email));
          break;
        case get_action.data_note_main_menu:
          res.status(200).json(await getNoteBookMainMenu(userId, email));
          break;
          case get_action.action_sorting:
          res.status(200).json(await getActionSorting(userId, email));
          break;
          case get_action.id_page_book:
          res.status(200).json(await getIdPageBook(userId, email));
          break;
        default:
          res.status(400).send("Invalid action");
          return;
      }
    } else {
      res.status(500).send("you are not authorized");
    }
  } catch (error) {    
    res.status(500).send(error);
  }
}
