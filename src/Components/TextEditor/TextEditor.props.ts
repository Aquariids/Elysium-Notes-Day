import { ContentState, EditorState } from "draft-js";
import { ReactNode } from "react";
import { BlockType, InlineStyle } from "./config";

export  interface ITextEditorProps {
    className: string;
}

export  interface ITextContextEditor {
    children: ReactNode
}

export interface LinkProps  {
    children: React.ReactNode;
    contentState: ContentState;
    entityKey: string;
  }


export interface EditorApi  {
    hasInlineStyle: any;
    toggleInlineStyle: any;
    toggleBlockType: (blockType: BlockType) => void;
    currentBlockType: BlockType;
    state: EditorState;
    onChange: (state: EditorState) => void;
}