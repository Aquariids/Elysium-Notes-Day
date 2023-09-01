import { UpdateAction, update_action } from "./actios";
import {
  updateBlockLink,
  updateDataInDatabase,
  updateDataTitle,
  updateNoteBookMainMenu,
} from "./auth/lib/dataFromDatabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  const action: UpdateAction = req.query.action as UpdateAction;
  try {
    const data = req.body;
    switch (action) {
      case update_action.editor:
        await updateDataInDatabase(data)
        res.status(200).send("Data editor updated successfully");
        break;
      case update_action.editor_title:
        await updateDataTitle(data)
        res.status(200).send("Data title updated successfully");
        break;
      case update_action.book_main_menu:
        await updateNoteBookMainMenu(data);
        res.status(200).send("Data bookMainMenu updated successfully");
        break;
      case update_action.block_link:
        await updateBlockLink(data);
        res.status(200).send("note hide");
        break;
      default:
        res.status(400).send("Invalid action");
        return;
    }
  } catch (error) {
    res.status(500).send("An error occurred while updating data");
  }
}
