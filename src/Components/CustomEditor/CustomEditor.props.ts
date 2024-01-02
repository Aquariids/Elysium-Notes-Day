import { EditorState } from "draft-js";

export interface EditorStateProps {
    editorState: EditorState;
    setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}

export interface CustomEditorProps { 
    setCheckTitle:any
    setDeleteElement: any
    setLoadingDelete:any
    selectedItem:any
    updateBooks:any
    all_id:string[]
}


export type updateDateProps = {updateDate:string, dateFull:string}
