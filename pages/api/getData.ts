import { GetAction, get_action } from "./actions";
import { NextApiRequest, NextApiResponse } from "next";
import {
  getSortingPreferences,
  getAllUserNotes,
  getAllUserNotesFromRecycle,
  getActiveNotebook,
  getAllUserNotebook,
  getMainMenuNote,
  getUserNotesFromNotebook,
  getActiveNotebookWithoutId,
  getAllUserNotesWithoutId,
} from "./auth/lib/Get";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const userId = req.query.userId;
  const email = req.query.email;
  const idPage = req.query.idPage;
  const withoutId:any = req.query.withoutId;

  const action: GetAction = req.query.action as GetAction;
  try {
    if (userId && email && session) {
      switch (action) {
        case get_action.get_all_user_notes:
          res.status(200).json(await getAllUserNotes(userId, email, withoutId));
          break;
        case get_action.get_user_notes_from_notebook:
          res
            .status(200)
            .json(await getUserNotesFromNotebook(userId, email, idPage));
          break;
        case get_action.get_all_user_notes_from_recycle:
          res.status(200).json(await getAllUserNotesFromRecycle(userId, email));
          break;
        case get_action.get_main_menu_note:
          res.status(200).json(await getMainMenuNote(userId, email));
          break;
        case get_action.get_sorting_preferences:
          res.status(200).json(await getSortingPreferences(userId, email));
          break;
        case get_action.get_all_user_notebook:
          res.status(200).json(await getAllUserNotebook(userId, email));
          break;
        case get_action.get_active_notebook_without_id:
          
          res.status(200).json(await getActiveNotebookWithoutId(userId, email));
          break;
        case get_action.get_active_notebook:
          res.status(200).json(await getActiveNotebook(userId, email));
          break;
          case get_action.get_all_user_notes_without_id:
          res.status(200).json(await getAllUserNotesWithoutId(userId, email));
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
