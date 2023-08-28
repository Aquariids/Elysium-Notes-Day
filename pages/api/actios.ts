// update actions
export type UpdateAction = "editor" | "editor_title" | "book_main_menu";

export const update_action = {
    editor:'editor',
    editor_title:'editor_title',
    book_main_menu:'book_main_menu'
}


// get actions
export type GetAction = "editor" | "editor_title" | "book_main_menu";

export const get_action = {
    data_editor:'data_editor',
    data_recycle:'data_recycle',
    data_note_main_menu:'data_note_main_menu'
}

// delete and restore actions
export type DeleteRestoreAction = "delete_one_notes_recycle" | "delete_one_notes" | "delete_all_notes_recycle" | "restore_data";

export const delete_restore_action = {
    delete_one_notes_recycle: "delete_one_notes_recycle",
    delete_one_notes: "delete_one_notes",
    delete_all_notes_recycle: "delete_all_notes_recycle",
    restore_data:"restore_data"
}
