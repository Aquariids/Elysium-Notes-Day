import {
  toggleInlineStyle,
  hasInlineStyleOf,
  toggleTextAlign,
} from "contenido";
import { EditorStateProps } from "../CustomEditor.props";
import cn from "classnames";
import s from "./Toolbar.module.scss";
import { RECYCLE } from "../../../../pages/api/paths";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HIGHLIGHTER_YELLOW, buttonProps, codeProps } from "./Toolbar.props";
import * as Icons from "./icons";
import { alignmentButtons, basicButtons, headingButtons } from "./Buttons";
import DropdownMenu from "@/Components/UI/DropdownMenu/DropdownMenu";
import dropdownStyle from "./DropdownMenuToolbar.module.scss";
const ToolbarButtons = ({
  editorState,
  setEditorState,
  code,
  setCode,
  modeCode,
  showToolbar,
  updateDate,
  hideNotes,
}: EditorStateProps & codeProps) => {
  const [headingButtonActive, setHeadingButtonActive] = useState(false);
  const [highlighterButtonActive, setHighlighterButtonActive] = useState(false);
  const router = useRouter();
  const toggleHighlighterYellow = () =>
    toggleInlineStyle(editorState, setEditorState, HIGHLIGHTER_YELLOW);
  const isHighlighterYellow = () => hasInlineStyleOf(editorState, HIGHLIGHTER_YELLOW);
  const [visibleShow, setVisibleShow] = useState(false);

  useEffect(() => {
    const buttons_heading = document.querySelectorAll(
      `.${s.btn_active_heading}`
    ).length;

    const buttons_highlighter = document.querySelectorAll(
      `.${s.btn_active_highlighter}`
    ).length;

    if (buttons_heading > 0) {
      setHeadingButtonActive(true);
    } else {
      setHeadingButtonActive(false);
    }

    if (buttons_highlighter > 0) {
      setHighlighterButtonActive(true);
    } else {
      setHighlighterButtonActive(false);
    }
  }, [editorState]);

  useEffect(() => {
    if (showToolbar) {
      // короче дял того, что бы бар выезжал мне нужен overflow: hidden
      setTimeout(() => {
        // анимация идет 1.2s. Поэтому я через  1.2 секунду делаю  overflow: visible
        setVisibleShow(true); // overflow: visible  нужен в свою очередь, что бы я нормально отображал выпадающие меню. Пока у меня только heading
      }, 1200);
    }
  }, [showToolbar]);

  const highlighterButtons: buttonProps[] = [
    {
      name: "highlighter",
      handler: toggleHighlighterYellow,
      detector: isHighlighterYellow,
      children: <Icons.SquareYellow />,
      title: "Выделение",
    },
  ];

  return (
    <div
      className={cn(s.toolbarHeader, {
        [s.visibleShow]: visibleShow === true,
      })}
    >
      <div
        className={cn(s.last_date_update, {
          [s.showDate]: showToolbar === false,
        })}
      >
        {router.asPath.split("/")[1] === `${RECYCLE}` ? (
          <span>Тут будет дата удаления заметки </span>
        ) : (
          <span
            title={
              !updateDate.updateDate
                ? ``
                : `Дата создания: ${updateDate.dateFull}`
            }
            className={cn({
              [s.hideNote]: hideNotes === true,
            })}
          >
            {updateDate.updateDate
              ? `Последние изменения: ${updateDate.updateDate}`
              : `Дата создания: ${updateDate.dateFull}`}
          </span>
        )}
      </div>
      <div
        className={cn(s.hideBtns, {
          [s.show]: showToolbar === true,
        })}
      >
        <div className={s.basic_btns}>
          {basicButtons.map((btn) => (
            <button
              title={btn.title}
              className={cn(s.btn, {
                [s.btn_active]: btn.detector(editorState) && code != true,
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
          <DropdownMenu
            icon={<Icons.Highlighter />}
            style={dropdownStyle}
            toolbar={highlighterButtonActive}
          >
            {highlighterButtons.map((btn) => (
              <button
                title={btn.title}
                className={cn(s.btn, s.heading_btn, {
                  [s.btn_active]: btn.detector(editorState) && code != true,
                  [s.btn_active_highlighter]:
                    btn.detector(editorState) && code != true,
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
          </DropdownMenu>
          <DropdownMenu
            icon={<Icons.Heading />}
            style={dropdownStyle}
            toolbar={headingButtonActive}
          >
            {headingButtons.map((btn) => (
              <button
                title={btn.title}
                className={cn(s.btn, s.heading_btn, {
                  [s.btn_active]: btn.detector(editorState) && code != true,
                  [s.btn_active_heading]:
                    btn.detector(editorState) && code != true,
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
          </DropdownMenu>
        </div>

        <div className={s.alignmentBtns}>
          {alignmentButtons.map((btn) => (
            <button
              title={btn.title}
              key={btn.name}
              className={cn(s.btn, {
                [s.btn_active]: btn.detector(editorState) && code != true,
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

        <button
          title="Режим для просмотра кода"
          className={cn(s.btn, {
            [s.btn_active_code]: code === true,
          })}
          onClick={() => {
            setCode(!code);
            modeCode();
          }}
        >
          <Icons.Code />
        </button>
      </div>
    </div>
  );
};

export default ToolbarButtons;
