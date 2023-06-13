import { isBold, isItalic, isUnderline, toggleBold, toggleItalic, toggleUnderline } from "contenido";
import { EditorState } from "draft-js";
import { EditorStateProps } from "./CustomEditor.props";

const toolbarButtons = [
  { name: "Bold", handler: toggleBold, detector: isBold },
  { name: "Italic", handler: toggleItalic, detector: isItalic },
  { name: "Underline", handler: toggleUnderline, detector: isUnderline },
];

const ToolbarButtons = ({editorState, setEditorState}:EditorStateProps) => {
  return (
    <>
      {toolbarButtons.map((btn) => (
        <button
          key={btn.name}
          onMouseDown={(e) => {
            e.preventDefault();
            btn.handler(editorState, setEditorState);
          }}
          style={{
            color: btn.detector(editorState) ? "skyblue" : "black",
          }}
        >
          {btn.name}
        </button>
      ))}
    </>
  );
};


export default ToolbarButtons;