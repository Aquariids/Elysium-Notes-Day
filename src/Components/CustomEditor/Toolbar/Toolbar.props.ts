import { EditorState } from "draft-js";
import { Dispatch,  SetStateAction } from "react";


export const HIGHLIGHTER_YELLOW:string = "HIGHLIGHTER_YELLOW";
export const HIGHLIGHTER_PINK:string = "HIGHLIGHTER_PINK";
export const HIGHLIGHTER_GREEN:string = "HIGHLIGHTER_GREEN";
export const HIGHLIGHTER_BLUE:string = "HIGHLIGHTER_BLUE";
export const HIGHLIGHTER_VIOLET:string = "HIGHLIGHTER_VIOLET";
export const HIGHLIGHTER_BROWN:string = "HIGHLIGHTER_BROWN";
export const HIGHLIGHTER_2N:string = "HIGHLIGHTER_2";
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
    updateDate: {
        updateDate:string,
        dateFull:string
    }
    hideNotes: boolean
  }