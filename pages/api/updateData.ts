import { UpdateAction, update_action } from "./actios";
import { NextApiRequest, NextApiResponse } from "next";
import {
  deleteIdPageForNote,
  updateActionSorting,
  updateBlockLink,
  updateBookForNotes,
  updateDataInDatabase,
  updateDataTitle,
  updateIdPageForNote,
  updateIdPageForOneNote,
  updateLastDate,
  updateModeCode,
  updateNoteBookMainMenu,
} from "./auth/lib/Update";

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  const action: UpdateAction = req.query.action as UpdateAction;
  try {
    const data = req.body;
    switch (action) {
      case update_action.editor:
        await updateDataInDatabase(data);
        res.status(200).send("Data editor updated successfully");
        break;
      case update_action.editor_title:
        await updateDataTitle(data);
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
      case update_action.mode_code:
        await updateModeCode(data);
        res.status(200).send("mode code");
        break;
      case update_action.action_sorting:
        await updateActionSorting(data);
        res.status(200).send("update sorting action");
        break;
      case update_action.update_date_last_changes:
        await updateLastDate(data);
        res.status(200).send("update date last changes");
        break;
      case update_action.update_id_page:
        await updateIdPageForNote(data);
        res.status(200).send("Data editor updated successfully");
        break;
      case update_action.update_id_page_one_note:
        await updateIdPageForOneNote(data);
        res.status(200).send("Data editor updated successfully");
        break;
      case update_action.delete_id_page:
        await deleteIdPageForNote(data);
        res.status(200).send("Data editor updated successfully");
        break;
      case update_action.update_id_book_for_all_notes:
        await updateBookForNotes(data);
        res.status(200).send("Data editor updated successfully");
        break;
      default:
        res.status(400).send("Invalid action");
        return;
    }
  } catch (error) {
    res.status(500).send("An error occurred while updating data");
  }
}
