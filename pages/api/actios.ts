// update actions
export type UpdateAction =
  | "editor"
  | "editor_title"
  | "book_main_menu"
  | "block_link"
  | "action_sorting"
  | "mode_code"
  | "update_date_last_changes"
  | "update_id_page"
  | "delete_id_page"
  | "update_id_page_one_note"
  | "update_id_page_all_note"
  | "update_id_book_for_all_notes";

// update action
export const update_action = {
  editor: "editor",
  editor_title: "editor_title",
  book_main_menu: "book_main_menu",
  block_link: "block_link",
  action_sorting: "action_sorting",
  mode_code: "mode_code",
  update_date_last_changes: "update_date_last_changes",
  update_id_page: "update_id_page",
  delete_id_page: "delete_id_page",
  update_id_page_one_note: "update_id_page_one_note",
  update_id_page_all_note: "update_id_page_all_note",
  update_id_book_for_all_notes: "update_id_book_for_all_notes",
};

// get actions
export type GetAction =
  | "editor"
  | "editor_title"
  | "book_main_menu"
  | "action_sorting"
  | "id_page_book"
  | "data_editorBook"
  | "id_for_books";

export const get_action = {
  data_editor: "data_editor",
  data_recycle: "data_recycle",
  data_note_main_menu: "data_note_main_menu",
  action_sorting: "action_sorting",
  id_page_book: "id_page_book",
  data_editorBook: "data_editorBook",
  id_for_books: "id_for_books",
};

// delete and restore actions
export type DeleteRestoreAction =
  | "delete_one_notes_recycle"
  | "delete_one_notes"
  | "delete_all_notes_recycle"
  | "restore_data"
  | "delete_id_page_book";

export const delete_restore_action = {
  delete_one_notes_recycle: "delete_one_notes_recycle",
  delete_one_notes: "delete_one_notes",
  delete_all_notes_recycle: "delete_all_notes_recycle",
  restore_data: "restore_data",
  delete_id_page_book: "delete_id_page_book",
};

// create actions
export type CreateAction =
  | "create_data"
  | "create_data_main_menu"
  | "create_data_sorting"
  | "create_book"
  | "create_book_for_notes";

export const create_data = {
  create_data: "create_data",
  create_data_main_menu: "create_data_main_menu",
  create_data_sorting: "create_data_sorting",
  create_book: "create_book",
  create_book_for_notes: "create_book_for_notes",
};
