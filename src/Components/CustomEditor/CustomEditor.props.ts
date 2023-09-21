import { EditorState } from "draft-js";

export interface EditorStateProps {
    editorState: EditorState;
    setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}


export type updateDateProps = {updateDate:string, dateFull:string}
