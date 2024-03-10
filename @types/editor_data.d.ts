type email = string;
type userId = string;
type _id = string;
interface user_note {
  block: boolean;
  body: string;
  code: boolean;
  date: string;
  dateShort: string;
  email: email;
  idPage: string;
  title: string;
  updateDae: string;
  userId: userId;
  _id: _id;
}

interface data_book {
  email: email;
  idPage: number;
  name: string;
  userId: userId;
  _id: _id;
}
interface notes_data {
  data_editor: user_note[];
  idpage: string;
  user_id: userId;
  email: email;
  data_book: data_book[];
  all_id: string[];
}
