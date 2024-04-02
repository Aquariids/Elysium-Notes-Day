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
import {
  BLUR,
  HIGHLIGHTER_BLUE,
  HIGHLIGHTER_BROWN,
  HIGHLIGHTER_GREEN,
  HIGHLIGHTER_PINK,
  HIGHLIGHTER_VIOLET,
  HIGHLIGHTER_YELLOW,
  buttonProps,
  codeProps,
} from "./Toolbar.props";
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
  const [visibleShow, setVisibleShow] = useState(false);
  const router = useRouter();
  
  const toggleHighlighterYellow = () => 
    toggleInlineStyle(editorState, setEditorState, HIGHLIGHTER_YELLOW);

  const isHighlighterYellow = () => 
    hasInlineStyleOf(editorState, HIGHLIGHTER_YELLOW);
  
  const toggleHighlighterPink = () => 
    toggleInlineStyle(editorState, setEditorState, HIGHLIGHTER_PINK);

  const isHighlighterPink = () =>
    hasInlineStyleOf(editorState, HIGHLIGHTER_PINK);

  const toggleHighlighterGreen = () =>
    toggleInlineStyle(editorState, setEditorState, HIGHLIGHTER_GREEN);
  const isHighlighterGreen = () =>
    hasInlineStyleOf(editorState, HIGHLIGHTER_GREEN);

  const toggleHighlighterBlue = () =>
    toggleInlineStyle(editorState, setEditorState, HIGHLIGHTER_BLUE);
  const isHighlighterBlue = () =>
    hasInlineStyleOf(editorState, HIGHLIGHTER_BLUE);

  const toggleHighlighterViolet = () =>
    toggleInlineStyle(editorState, setEditorState, HIGHLIGHTER_VIOLET);
  const isHighlighterViolet = () =>
    hasInlineStyleOf(editorState, HIGHLIGHTER_VIOLET);

  const toggleHighlighterBrown = () =>
    toggleInlineStyle(editorState, setEditorState, HIGHLIGHTER_BROWN);
  const isHighlighterBrown = () =>
    hasInlineStyleOf(editorState, HIGHLIGHTER_BROWN);

    const toggleBlur = () =>
    toggleInlineStyle(editorState, setEditorState, BLUR);
  const isBlur = () =>
    hasInlineStyleOf(editorState, BLUR);

    const blur =  {
      name: "BLUR",
      handler: toggleBlur,
      detector: isBlur,
      children: <Icons.Blur/>,
      title: "Скрыть строку",
    }


  const allBasicButtons = [...basicButtons, blur];
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
      name: "HIGHLIGHTER_YELLOW",
      handler: toggleHighlighterYellow,
      detector: isHighlighterYellow,
      children: <Icons.Square className = {s.highlighter_yellow} />,
      title: "Выделение желтым",
    },
    {
      name: "HIGHLIGHTER_PINK",
      handler: toggleHighlighterPink,
      detector: isHighlighterPink,
      children: <Icons.Square className = {s.highlighter_pink} />,
      title: "Выделение розовым",
    },
    {
      name: "HIGHLIGHTER_GREEN",
      handler: toggleHighlighterGreen,
      detector: isHighlighterGreen,
      children: <Icons.Square className = {s.highlighter_green} />,
      title: "Выделение зеленым",
    },
    {
      name: "HIGHLIGHTER_BLUE",
      handler: toggleHighlighterBlue,
      detector: isHighlighterBlue,
      children: <Icons.Square className = {s.highlighter_blue} />,
      title: "Выделение синим",
    },
    {
      name: "HIGHLIGHTER_VIOLET",
      handler: toggleHighlighterViolet,
      detector: isHighlighterViolet,
      children: <Icons.Square className = {s.highlighter_violet} />,
      title: "Выделение фиолетовым",
    },
    {
      name: "HIGHLIGHTER_BROWN",
      handler: toggleHighlighterBrown,
      detector: isHighlighterBrown,
      children: <Icons.Square className = {s.highlighter_brown} />,
      title: "Выделение коричневым",
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
        <span className={cn({
          [s.hideNote]: hideNotes === true,
        })} > {
          
          !updateDate.deleteDate
                ? ``
                : `Дата удаления: ${updateDate.deleteDate}`
          } </span>
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
        className={cn(s.hideBtns, s.mobile, {
          [s.show]: showToolbar === true,
        })}
      >
        <div className={s.all__btns}>
        <div className={s.basic_btns}>
          {allBasicButtons.map((btn) => (
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
          {
            
          }
          <DropdownMenu
            icon={<Icons.Highlighter />}
            style={dropdownStyle}
            toolbarMainButton={highlighterButtonActive}
            tollbarActive = {true}
          >
            {highlighterButtons.map((btn) => (        
              <button
                title={btn.title}
                className={cn(s.btn_highlighter, s.heading_btn, {
                  [s.btn_active_highlighter]:btn.detector(editorState) && code != true
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
            toolbarMainButton={headingButtonActive}
            tollbarActive = {true}
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
              <div className={s.btn__code}>
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
      </div>
    </div>
  );
};

export default ToolbarButtons;
