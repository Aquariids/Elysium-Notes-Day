import {
  isBold,
  isItalic,
  isUnderline,
  toggleBold,
  toggleItalic,
  toggleUnderline,
  toggleBlockquote,
  toggleOL,
  isOL,
  isBlockquote,
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
import * as Icons from "./icons";

const ToolbarButtons = ({ editorState, setEditorState }: EditorStateProps) => {
  const HIGHLIGHTER = "HIGHLIGHTER";

  const toggleHighlighter = () =>
    toggleInlineStyle(editorState, setEditorState, HIGHLIGHTER);
  const isHighlighter = () => hasInlineStyleOf(editorState, HIGHLIGHTER);

  const toolbarButtons = [
    {
      name: "bold",
      handler: toggleBold,
      detector: isBold,
      children: <Icons.Bold />,
    },
    {
      name: "Italic",
      handler: toggleItalic,
      detector: isItalic,
      children: <Icons.Italic />,
    },
    {
      name: "Underline",
      handler: toggleUnderline,
      detector: isUnderline,
      children: <Icons.Underline />,
    },
    {
      name: "list-ul",
      handler: toggleUL,
      detector: isUL,
      children: <Icons.ListUl />,
    },
    {
      name: "list-ol",
      handler: toggleOL,
      detector: isOL,
      children: <Icons.ListOl />,
    },
    {
      name: "blockQuote",
      handler: toggleBlockquote,
      detector: isBlockquote,
      children: <Icons.BlockQuote />,
    },
    {
      name: "highlighter",
      handler: toggleHighlighter,
      detector: isHighlighter,
      children: <Icons.Highlighter />,
    },
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
          className={cn(s.btn, {
            [s.btn_active]: btn.detector(editorState),
          })}
          name={btn.name}
          key={btn.name}
          onMouseDown={(e) => {
            e.preventDefault();
            btn.handler(editorState, setEditorState);
          }}
        >
          {btn.children}
        </button>
      ))}
      <div className={s.alignmentBtns}>
        {alignmentButtons.map((btn) => (
          <button
            key={btn.name}
            className={cn(s.btn, {
              [s.btn_active]: btn.detector(editorState),
            })}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleTextAlign(
                editorState,
                setEditorState,
                `text-align-${btn.name}`
              );
            }}
          >
            {btn.children}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ToolbarButtons;
