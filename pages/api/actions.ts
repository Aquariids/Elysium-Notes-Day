// update actions
export type UpdateAction =
  | "update_note_content"
  | "update_note_title"
  | "update_main_menu_note"
  | "update_note_visibility"
  | "update_sorting_preferences"
  | "update_code_highlighting"
  | "update_note_last_modified_date"
  | "update_notebook_id_for_note"
  | "update_active_notebook"
  | "update_note_deletion_date"

// update action

export const update_action = {
  update_note_content: "update_note_content",
  update_note_title: "update_note_title",
  update_main_menu_note: "update_main_menu_note",
  update_note_visibility: "update_note_visibility",
  update_sorting_preferences: "update_sorting_preferences",
  update_code_highlighting: "update_code_highlighting",
  update_note_last_modified_date: "update_note_last_modified_date",
  update_notebook_id_for_note: "update_notebook_id_for_note",
  update_active_notebook: "update_active_notebook",
  update_note_deletion_date:'update_note_deletion_date',
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
  | "delete_id_page_book"
  | "remove_notebook_id_from_note";

export const delete_restore_action = {
  delete_one_notes_recycle: "delete_one_notes_recycle",
  delete_one_notes: "delete_one_notes",
  delete_all_notes_recycle: "delete_all_notes_recycle",
  restore_data: "restore_data",
  delete_id_page_book: "delete_id_page_book",
  remove_notebook_id_from_note: "remove_notebook_id_from_note",
};

// create actions
export type CreateAction =
  | "create_user_note"
  | "initialize_main_menu_note"
  | "initialize_sorting_preferences"
  | "create_notebook"
  | "initialize_master_notebook";

export const create_data_action = {
  create_user_note: "create_user_note",
  initialize_main_menu_note: "initialize_main_menu_note",
  initialize_sorting_preferences: "initialize_sorting_preferences",
  create_notebook: "create_notebook",
  initialize_master_notebook: "initialize_master_notebook",
};
