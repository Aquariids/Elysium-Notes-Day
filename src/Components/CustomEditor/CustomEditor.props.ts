import { EditorState } from "draft-js";
import React from "react";

export interface EditorStateProps {
    editorState: EditorState;
    setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}