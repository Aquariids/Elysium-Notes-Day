import { useEffect } from "react";
import { GetAction, get_action } from "./actios";
import {
  getAllNotesFromDatabase,
  getAllNotesFromDatabaseRecycle,
  getNoteBookMainMenu,
} from "./auth/lib/dataFromDatabase";
import { NextApiRequest, NextApiResponse } from "next";


export default async function GET(req: NextApiRequest, res: NextApiResponse) {
 const sort = req.query.sort;
  console.log("🚀 ~ file: getData.ts:13 ~ GET ~ sort:", sort)
  const userId = req.query.userId;
  const email = req.query.email;
  const action: GetAction = req.query.action as GetAction;
  try {
    if (userId && email) {
      switch (action) {
        case get_action.data_editor:
          res.status(200).json(await getAllNotesFromDatabase(userId, email,sort));
          break;
        case get_action.data_recycle:
          res.status(200).json(await getAllNotesFromDatabaseRecycle(userId, email));
          break;
        case get_action.data_note_main_menu:
          res.status(200).json(await getNoteBookMainMenu(userId, email));
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
