
type email = string;
type userId = string;
type _id = string;

interface create_user_note {
  block: boolean;
  body: string;
  code: boolean;
  date: string | DateTime;
  dateShort: string | DateTime;
  deleteDate: string | DateTime;
  dateFull: string | DateTime;
  email: email;
  idPage: string;
  title: string;
  userId: userId;
}


interface user_note extends create_user_note {
_id:_id
}

interface data_nootebook {
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
  data_nootebook: data_nootebook[];
  all_id: string[];
  without_id_props:boolean
  data:any
}
