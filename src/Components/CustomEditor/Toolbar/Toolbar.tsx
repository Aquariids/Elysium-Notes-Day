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
import {useEffect, useRef, useState } from "react";
import { HIGHLIGHTER, buttonProps, codeProps } from "./Toolbar.props";
import * as Icons from "./icons";
import { alignmentButtons, basicButtons, headingButtons } from "./Buttons";

const ToolbarButtons = ({
  editorState,
  setEditorState,
  code,
  setCode,
  modeCode,
  showToolbar,
  updateDate,
  hideNotes
}: EditorStateProps & codeProps) => {
  const refActiveMenu = useRef<HTMLDivElement>(null);
  const [headingButtonActive, setHeadingButtonActive] = useState(false)
  const router = useRouter();
  const toggleHighlighter = () =>
    toggleInlineStyle(editorState, setEditorState, HIGHLIGHTER);
  const isHighlighter = () => hasInlineStyleOf(editorState, HIGHLIGHTER);
const [visibleShow, setVisibleShow] = useState(false);



useEffect(() => {
  const buttons = document.querySelectorAll(`.${s.btn_active1}`).length;
  
  if(buttons > 0) {
    setHeadingButtonActive(true)
  } else {
    setHeadingButtonActive(false)
  }

},[editorState])

useEffect(()=>{

  if(showToolbar) { // короче дял того, что бы бар выезжал мне нужен overflow: hidden 
    setTimeout(() => { // анимация идет 1.2s. Поэтому я через  1.2 секунду делаю  overflow: visible 
      setVisibleShow(true) // overflow: visible  нужен в свою очередь, что бы я нормально отображал выпадающие меню. Пока у меня только heading
    }, 1200)
  }
},[showToolbar])


const myButtons: buttonProps[] = [
  {
    name: "highlighter",
    handler: toggleHighlighter,
    detector: isHighlighter,
    children: <Icons.Highlighter />,
    title: "Выделение",
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
          <span title={!updateDate.updateDate ? ``:`Дата создания: ${updateDate.dateFull}`} className={cn({
            [s.hideNote] : hideNotes === true
          })}>{ updateDate.updateDate ? `Последние изменения: ${updateDate.updateDate}`:`Дата создания: ${updateDate.dateFull}` }</span>
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
          {myButtons.map((btn) => (
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
                  className={cn(s.btn, s.heading_btn, {
                    [s.btn_active1]: btn.detector(editorState) && code != true,
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
