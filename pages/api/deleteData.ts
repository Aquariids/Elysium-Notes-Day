import {
  deleteAllData,
  deleteData,
  deleteDataRecycle,
} from "./auth/lib/dataFromDatabase";
import { NextApiRequest, NextApiResponse } from "next";
interface IRequest {
  req: NextApiRequest;
  query: {
    _id: string;
    userId: string;
  };
}

export default async function handler(req: IRequest, res: NextApiResponse) {
  const _id = req.query._id;
  const userId = req.query.userId;
  const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(_id); // проверка на то, что _id mongodb в корректном формате

  try {
    switch (action) {
      case "delete_one_notes_recycle":
        isValidObjectId && (await deleteDataRecycle(_id, userId));
        res.status(200).send("Запись из корзины удалена");
        break;
      case "delete_one_notes":
        isValidObjectId && (await deleteData(_id, userId));
        res.status(200).send("Запись перенесена в корзину");
        break;
      case "delete_all_notes_recycle":
        userId && (await deleteAllData(userId));
        res.status(200).send("Все записи удалены");
        break;
    }
  } catch (error) {
    res
      .status(500)
      .send(
        "Недопустимый формат идентификатора _id  или несуществующий userId"
      );
  }
}

// if(!isValidObjectId) {
//     res.status(500).json({ message: 'Недопустимый формат идентификатора _id'});
// } else {
//     await deleteDataRecycle(_id, userId);
//     res.status(200).send('Все окей, бро');
// }
