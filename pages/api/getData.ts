import { GetAction, get_action } from "./actios";
import { NextApiRequest, NextApiResponse } from "next";
import {
  getActionSorting,
  getAllNotesFromDatabase,
  getAllNotesFromDatabaseRecycle,
  getIdForAllBooks,
  getIdPageBook,
  getNoteBookMainMenu,
  getNotesFromBook,
} from "./auth/lib/Get";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  const userId = req.query.userId;
  const email = req.query.email;
  const idPage = req.query.idPage;

  
  const action: GetAction = req.query.action as GetAction;
  try {
    if (userId && email && session) {
      switch (action) {
        case get_action.data_editor:
          res.status(200).json(await getAllNotesFromDatabase(userId, email));
          break;
        case get_action.data_editorBook:
          res.status(200).json(await getNotesFromBook(userId, email, idPage));
          break;
        case get_action.data_recycle:
          res
            .status(200)
            .json(await getAllNotesFromDatabaseRecycle(userId, email));
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

          case get_action.id_for_books:
          res.status(200).json(await getIdForAllBooks(userId, email));
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
