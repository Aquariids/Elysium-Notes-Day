import { EditorState } from "draft-js";
import { Dispatch, ReactNode, SetStateAction } from "react";


export const HIGHLIGHTER:string = "HIGHLIGHTER";
export interface buttonProps {
        name: string;
        handler: (editorState: EditorState , setEditorState: Dispatch<SetStateAction<EditorState>>) => void;
        detector: (editorState: any) => boolean;
        children: React.ReactNode;
        title: string;
}

export interface alignmentButtonProps {
    name: string;
    detector: (editorState: any) => boolean;
    children: React.ReactNode;
    title: string;
}
export interface codeProps {
    code: boolean;
    setCode: any;
    showToolbar: boolean;
    modeCode: () => {};
    updateDate: string
  }