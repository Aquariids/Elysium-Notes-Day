import { DeleteRestoreAction } from "./actios";

import { NextApiRequest, NextApiResponse } from "next";
import {
  deleteAllData,
  deleteData,
  deleteDataRecycle,
  deleteIdPageBook,
  restoreDataRecycle,
} from "./auth/lib/Delete_Restore";
interface IRequest {
  req: NextApiRequest;
  query: {
    action: DeleteRestoreAction;
    _id: string;
    userId: string;
  };
}

export default async function handler(req: IRequest, res: NextApiResponse) {
  const _id = req.query._id;
  const userId = req.query.userId;
  const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(_id); // проверка на то, что _id mongodb в корректном формате
  const action: DeleteRestoreAction = req.query.action as DeleteRestoreAction;
  if (!userId) res.status(500).send("Non-existent userId. Please log in.");
  else {
    try {
      switch (action) {
        case "delete_one_notes_recycle":
          isValidObjectId && (await deleteDataRecycle(_id, userId));
          res.status(200).send("note moved to recycle bin");
          break;
        case "delete_one_notes":
          isValidObjectId && (await deleteData(_id, userId));
          res
            .status(200)
            .send("The note has been deleted from the recycle bin");
          break;
        case "delete_all_notes_recycle":
          userId && (await deleteAllData(userId));
          res.status(200).send("All notes deleted");
          break;
        case "delete_id_page_book":
          isValidObjectId && (await deleteIdPageBook(_id, userId));
          res
            .status(200)
            .send("The note has been deleted from the recycle bin");
          break;
        case "restore_data":
          await restoreDataRecycle(_id, userId);
          res.status(200).send("Note restored");
          break;
      }
    } catch (error) {
      res.status(500).send("Invalid _id format");
    }
  }
}
