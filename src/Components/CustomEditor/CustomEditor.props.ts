import { EditorState } from "draft-js";
import React, { HTMLAttributes } from "react";

export interface EditorStateProps {
    editorState: EditorState;
    setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}


import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";

export interface ModalProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {

}