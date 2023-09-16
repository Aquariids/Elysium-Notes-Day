// update actions
export type UpdateAction = "editor" | "editor_title" | "book_main_menu" | "block_link" | "action_sorting" | 'mode_code';

export const update_action = {
    editor:'editor',
    editor_title:'editor_title',
    book_main_menu:'book_main_menu',
    block_link:'block_link',
    action_sorting:'action_sorting',
    mode_code:'mode_code'
}


// get actions
export type GetAction = "editor" | "editor_title" | "book_main_menu" | 'action_sorting';

export const get_action = {
    data_editor:'data_editor',
    data_recycle:'data_recycle',
    data_note_main_menu:'data_note_main_menu',
    action_sorting:'action_sorting'
}

// delete and restore actions
export type DeleteRestoreAction = "delete_one_notes_recycle" | "delete_one_notes" | "delete_all_notes_recycle" | "restore_data";

export const delete_restore_action = {
    delete_one_notes_recycle: "delete_one_notes_recycle",
    delete_one_notes: "delete_one_notes",
    delete_all_notes_recycle: "delete_all_notes_recycle",
    restore_data:"restore_data"
}


// create actions
export type CreateAction = "create_data" | "create_data_main_menu" | 'create_data_sorting';

export const create_data = {
    create_data: "create_data",
    create_data_main_menu: "create_data_main_menu",
    create_data_sorting:'create_data_sorting'

}