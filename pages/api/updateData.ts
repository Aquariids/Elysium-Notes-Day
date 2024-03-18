import { UpdateAction, update_action } from "./actions";
import { NextApiRequest, NextApiResponse } from "next";
import {
  updateSortingPreferences,
  updateNoteVisibility,
  updateNoteContent,
  updateNoteTitle,
  updateNotebookIdForNote,
  updateNoteLastModifiedDate,
  updateCodeHighlighting ,
  updateNoteBookMainMenu,
  updateNoteDeletionDate,
  updateActiveNotebook,
  updateActiveNotebookWithoutId,
} from "./auth/lib/Update";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  const action: UpdateAction = req.query.action as UpdateAction;
  try {

    if(session) {      
      const data = req.body;
      switch (action) {
        case update_action.update_note_content:
          await updateNoteContent(data);
          res.status(200).send("Data editor updated successfully");
          break;
        case update_action.update_note_title:
          await updateNoteTitle(data);
          res.status(200).send("Data title updated successfully");
          break;
        case update_action.update_main_menu_note:
          await updateNoteBookMainMenu(data);
          res.status(200).send("Data bookMainMenu updated successfully");
          break;
        case update_action.update_note_visibility:
          await updateNoteVisibility(data);
          res.status(200).send("note hide");
          break;
        case update_action.update_code_highlighting :
          await updateCodeHighlighting (data);
          res.status(200).send("mode code");
          break;
        case update_action.update_sorting_preferences:
          await updateSortingPreferences(data);
          res.status(200).send("update sorting action");
          break;
        case update_action.update_note_last_modified_date:
          await updateNoteLastModifiedDate(data);
          res.status(200).send("update date last changes");
          break;
        case update_action.update_notebook_id_for_note:
          await updateNotebookIdForNote(data);
          res.status(200).send("Data editor updated successfully");
          break;
        case update_action.update_active_notebook:
          await updateActiveNotebook(data);
          res.status(200).send("Data editor updated successfully");
          break;
          case update_action.update_active_notebook_without_id:
          await updateActiveNotebookWithoutId(data);
          res.status(200).send("Data editor updated successfully");
          break;
          case update_action.update_note_deletion_date:
          await updateNoteDeletionDate(data);
          res.status(200).send("Data editor updated successfully");
          break;
          
          
        default:
          res.status(400).send("Invalid action");
          return;
      }
    } 
    else {
      res.status(500).send("An error occurred while updating data");
    }
    
  } catch (error) {
    res.status(500).send(error);
  }
}
