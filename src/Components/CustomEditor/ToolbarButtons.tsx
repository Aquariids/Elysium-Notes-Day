import { isBold, isItalic, isUnderline, toggleBold, toggleItalic, toggleUnderline, toggleSub, isSub, toggleH1, isH1} from "contenido";
import { EditorStateProps } from "./CustomEditor.props";

const toolbarButtons = [
  { name: "Bold", handler: toggleBold, detector: isBold },
  { name: "Italic", handler: toggleItalic, detector: isItalic },
  { name: "Underline", handler: toggleUnderline, detector: isUnderline },
  { name: 'Sub', handler: toggleSub, detector:isSub },
  { name: 'h1', handler: toggleH1, detector:isH1 },
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