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
  isLineThrough,
  toggleLineThrough,
  isH1,
  toggleH1,
  isH2,
  toggleH2,
  isH3,
  toggleH3,
  isH4,
  toggleH4,
  isH5,
  toggleH5,
  isH6,
  toggleH6,
} from "contenido";
import { EditorStateProps } from "./CustomEditor.props";
import cn from "classnames";
import s from "./ToolbarButtons.module.scss";
import * as Icons from "./icons";
import { RECYCLE } from "../../../pages/api/paths";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
interface codeProps {
  code: boolean;
  setCode: any;
  showToolbar: boolean;
  modeCode: () => {};
}
const ToolbarButtons = ({
  editorState,
  setEditorState,
  code,
  setCode,
  modeCode,
  showToolbar,
}: EditorStateProps & codeProps) => {
  const refActiveMenu = useRef<HTMLDivElement>(null);
  const [headingButtonActive, setHeadingButtonActive] = useState(false)
  const router = useRouter();
  const HIGHLIGHTER = "HIGHLIGHTER";
  const toggleHighlighter = () =>
    toggleInlineStyle(editorState, setEditorState, HIGHLIGHTER);
  const isHighlighter = () => hasInlineStyleOf(editorState, HIGHLIGHTER);
const [visibleShow, setVisibleShow] = useState(false);



useEffect(()=>{

  if(showToolbar) { // короче дял того, что бы бар выезжал мне нужен overflow: hidden 
    setTimeout(() => { // анимация идет 1.2s. Поэтому я через  1.2 секунду делаю  overflow: visible 
      setVisibleShow(true) // overflow: visible  нужен в свою очередь, что бы я нормально отображал выпадающие меню. Пока у меня только heading
    }, 1200)
  }
},[showToolbar])
  const headingButtons = [
    {
      name: "h1",
      handler: toggleH1,
      detector: isH1,
      children: <Icons.H1 />,
      title: "Заголовок 1",
    },
    {
      name: "h2",
      handler: toggleH2,
      detector: isH2,
      children: <Icons.H2 />,
      title: "Заголовок 2",
    },
    {
      name: "h3",
      handler: toggleH3,
      detector: isH3,
      children: <Icons.H3 />,
      title: "Заголовок 3",
    },
    {
      name: "h4",
      handler: toggleH4,
      detector: isH4,
      children: <Icons.H4 />,
      title: "Заголовок 4",
    },
    {
      name: "h5",
      handler: toggleH5,
      detector: isH5,
      children: <Icons.H5 />,
      title: "Заголовок 5",
    },
    {
      name: "h6",
      handler: toggleH6,
      detector: isH6,
      children: <Icons.H6 />,
      title: "Заголовк 6",
    },
  ];
  const toolbarButtons = [
    {
      name: "bold",
      handler: toggleBold,
      detector: isBold,
      children: <Icons.Bold />,
      title: "Жирный",
    },
    {
      name: "Italic",
      handler: toggleItalic,
      detector: isItalic,
      children: <Icons.Italic />,
      title: "Курсив",
    },
    {
      name: "Underline",
      handler: toggleUnderline,
      detector: isUnderline,
      children: <Icons.Underline />,
      title: "Подчеркивание",
    },
    {
      name: "list-ul",
      handler: toggleUL,
      detector: isUL,
      children: <Icons.ListUl />,
      title: "Маркированный список",
    },
    {
      name: "list-ol",
      handler: toggleOL,
      detector: isOL,
      children: <Icons.ListOl />,
      title: "Нумерованный список",
    },
    {
      name: "blockQuote",
      handler: toggleBlockquote,
      detector: isBlockquote,
      children: <Icons.BlockQuote />,
      title: "Цитата",
    },
    {
      name: "highlighter",
      handler: toggleHighlighter,
      detector: isHighlighter,
      children: <Icons.Highlighter />,
      title: "Выделение",
    },

    {
      name: "strikethrough",
      handler: toggleLineThrough,
      detector: isLineThrough,
      children: <Icons.Strikethrough />,
      title: "Зачеркнутый",
    },
  ];

  const alignmentButtons = [
    {
      name: "left",
      detector: isTextLeftAligned,
      children: <Icons.AlignLeft />,
      title: "Выравнивание по левому краю",
    },
    {
      name: "center",
      detector: isTextCenterAligned,
      children: <Icons.AlignCenter />,
      title: "Выравнивание по центру",
    },
    {
      name: "right",
      detector: isTextRightAligned,
      children: <Icons.AlignRight />,
      title: "Выравнивание по правому краю",
    },
    {
      name: "justify",
      detector: isTextJustifyAligned,
      children: <Icons.AlignJustify />,
      title: "Выравнивание по ширине",
    },
  ];

 

  
  return (
    <div className={cn(s.toolbarHeader, {
      [s.visibleShow]: visibleShow === true
    })}>
      <div
        className={cn(s.last_date_update, {
          [s.showDate]: showToolbar === false,
        })}
      >
        {router.asPath.split("/")[1] === `${RECYCLE}` ? (
          <span>Тут будет дата удаления заметки </span>
        ) : (
          <span>Тут будет дата последнего изменения заметки</span>
        )}
      </div>

      <div
        className={cn(s.hideBtns, {
          [s.show]: showToolbar === true,
        })}
      >
        <div className={s.basic_btns}>
          {toolbarButtons.map((btn) => (
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
          <div ref={refActiveMenu} className={s.dropdown}>
            <button 
            className={cn(s.dropbtn, {
              [s.btn_active]: headingButtonActive === true,
            })}
             >
              <Icons.Heading/>
            </button>
            <div 
              className={cn(s.dropdown_content, {
             
              })}>
              {headingButtons.map((btn) => (
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
                    setHeadingButtonActive(true)
                  }}
                >
                  {btn.children}
                </button>
              ))}
            </div>
          </div>
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
