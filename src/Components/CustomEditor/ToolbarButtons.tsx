import {
  isBold,
  isItalic,
  isUnderline,
  toggleBold,
  toggleItalic,
  toggleUnderline,
  toggleSub,
  toggleH1,
  isH1,
  toggleUL,
  isUL,
  toggleInlineStyle,
  hasInlineStyleOf,
  toggleTextAlign,
  isTextCenterAligned,
  isTextLeftAligned,
  isTextRightAligned,
  isTextJustifyAligned,
} from "contenido";
import { EditorStateProps } from "./CustomEditor.props";
import cn from "classnames";
import s from "./CustomEditor.module.scss";
import ToolbarButton from "../UI/ToolbarButton/ToolbarButton";
import * as Icons from "./icons";

const ToolbarButtons = ({ editorState, setEditorState }: EditorStateProps) => {
  const COLORIZE = "COLORIZE";

  const toggleColorize = () =>
    toggleInlineStyle(editorState, setEditorState, COLORIZE);
  const isColorize = () => hasInlineStyleOf(editorState, COLORIZE);

  const toolbarButtons = [
    {
      name: "bold",
      handler: toggleBold,
      detector: isBold,
      children: <Icons.Bold className={s.bold} />,
    },
    {
      name: "Italic",
      handler: toggleItalic,
      detector: isItalic,
      children: <Icons.Italic />,
    },
    { name: "Underline", handler: toggleUnderline, detector: isUnderline },
    { name: "Список", handler: toggleUL, detector: isUL },
    { name: "h1", handler: toggleH1, detector: isH1 },
    { name: "colorize", handler: toggleColorize, detector: isColorize },
  ];

  const alignmentButtons = [
    {
      name: "left",
      detector: isTextLeftAligned,
      children: <Icons.AlignLeft />,
    },
    {
      name: "center",
      detector: isTextCenterAligned,
      children: <Icons.AlignCenter />,
    },
    {
      name: "right",
      detector: isTextRightAligned,
      children: <Icons.AlignRight />,
    },
    {
      name: "justify",
      detector: isTextJustifyAligned,
      children: <Icons.AlignRight />,
    },
  ];
  return (
    <div className={s.toolbarHeader}>
      {toolbarButtons.map((btn) => (
        <button
          className={s.btn}
          name={btn.name}
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

      {alignmentButtons.map((button) => (
        <button
          key={button.name}
          style={{
            minWidth: "2rem",
            padding: "0.5rem",
            backgroundColor: button.detector(editorState)
              ? "#4cb5f5"
              : "rgba(125, 125, 125, 0.25)",
            color: button.detector(editorState) ? "#fff" : "inherit",
            borderRadius: "0.5rem",
            border: "none",
            cursor: "pointer",
            textTransform: "capitalize",
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleTextAlign(
              editorState,
              setEditorState,
              `text-align-${button.name}`
            );
          }}
        >
          {button.children}
        </button>
      ))}
    </div>
  );
};

export default ToolbarButtons;
