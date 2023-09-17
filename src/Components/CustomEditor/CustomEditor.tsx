import {
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import {
  getDefaultKeyBindingFn,
  shortcutHandler,
  Editor,
  blockStyleFn,
} from "contenido";

import ToolbarButtons from "./ToolbarButtons";
import { useSession } from "next-auth/react";
import s from "./CustomEditor.module.scss";
import TextareaAutosize from "react-textarea-autosize";
import { useRouter } from "next/router";
import cn from "classnames";
import DotsMenu from "./dots.svg";
import ButtonDeleteNotes from "../ButtonDeleteNotes/ButtonDeleteNotes";
import { styleMap } from "./styleMap";
import WrapperEditorRecycle from "./WrapperEditorRecycle";
import { update_action } from "../../../pages/api/actios";
import { RECYCLE } from "../../../pages/api/paths";
import hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';
hljs.registerLanguage('javascript', javascript);
import 'highlight.js/styles/school-book.css';
import DraftTextForCode from "./DraftTextForCode";
const CustomEditor = ({
  id,
  body,
  title,
  setCheckTitle,
  data,
  setDeleteElement,
  setLoadingDelete,
  hideNotes,
  selectedItem
}: any) => {
  const [dotsMenuActive, setDotsMenuActive] = useState<boolean>(false);
  const [value, setValue] = useState(title);
  const [code, setCode] = useState(selectedItem.code || false)
  const { data: session } = useSession();
  const _id = id;
  const router = useRouter();
  const [routerReclycle, setRouterReclycle] = useState<boolean>();
  useEffect(() => {
    hljs.initHighlighting();
},[code]);
  const refActiveMenu = useRef<HTMLDivElement>(null);
  const btn_hide = hideNotes ? <>Показать заметку</> : <>Скрыть заметку</>;    
  async function hideLink(currentLink: any) {
    if (selectedItem) {
      const updatedLink = { ...selectedItem, block: !selectedItem.block }; 
      try {
        const updateRes = await fetch(
          `/api/updateData?action=${update_action.block_link}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedLink),
          }
        );

        if (updateRes.ok) {
          router.push(currentLink);
        } else {
          console.error("Ошибка при обновлении данных");
        }
      } catch (error) {
        console.error("Ошибка при обновлении данных:", error);
      }
    } else {
      console.error("Ссылка не найдена");
    }
  }

  async function modeCode() {
    if (selectedItem) {
      const updatedLink = { ...selectedItem, code: !code}; 
      try {
        const updateRes = await fetch(
          `/api/updateData?action=${update_action.mode_code}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedLink),
          }
        );

      } catch (error) {
        console.error("Ошибка при обновлении данных:", error);
      }
    } else {
      console.error("Ссылка не найдена");
    }
  }
  useEffect(() => {
    setRouterReclycle(router.asPath.split("/")[1] === `${RECYCLE}`);
  }, []);
  // useEffect(() => {
  //   const screenWidth = window.screen.width;
  //   const pageWidth = document.documentElement.scrollWidth;
  //   console.log(pageWidth);
  // });
  // convertFromRaw - с помощью этого метода мы наш пустой объект превращаем в спец объект для draft js
  const [editorState, setEditorState] = useState(() => {
    const contentState = convertFromRaw(JSON.parse(body)); // и теперь на основе нашего спец объекта мы создаем состояние редактора. Изначально оно пустое.
    return EditorState.createWithContent(contentState);
  });

  const editorStateMemo = useMemo(() => {
    const contentState = convertFromRaw(JSON.parse(body)); // тут мы парсим данные с базы в спец объект draft js
    return EditorState.createWithContent(contentState); // и на его основе меняем состояние редактора
  }, [body]);
  useEffect(() => {
    if (body) {
      setEditorState(editorStateMemo);
    }
  }, [body]);

  const handleEditorChange = useCallback(
    (editorState: SetStateAction<EditorState>) => {
      setEditorState(editorState);
      
    },
    []
  );

  const handleOutsideClick = (event: any) => {
    if (
      refActiveMenu.current &&
      !refActiveMenu.current.contains(event.target)
    ) {
      setDotsMenuActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick, false);
    return () => {
      document.removeEventListener("click", handleOutsideClick, false);
    };
  }, []);

  useEffect(() => {
    setValue(title);
  }, [title]);

  const updateData = useCallback(
    async (editorState: any, session: any, _id: string) => {
      const content = JSON.stringify(
        convertToRaw(editorState.getCurrentContent())
      );
      const data = {
        email: session?.user.email,
        userId: session?.user.userId,
        _id: _id,
        body: content,
      };

      try {
        const response = await fetch(
          `/api/updateData?action=${update_action.editor}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
      } catch (error) {
        console.log(
          "🚀 ~ file: CustomEditor.tsx:66 ~ updateData ~ error:",
          error
        );
      }
    },
    []
  );

  const updateTitle = useCallback(
    async (session: any, _id: string, title: string) => {
      const data = {
        email: session?.user.email,
        userId: session?.user.userId,
        _id: _id,
        title: title,
      };

      try {
        const response = await fetch(
          `/api/updateData?action=${update_action.editor_title}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
      } catch (error) {
        alert(error);
      }
    },
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (routerReclycle === false) {
        updateData(editorState, session, _id);
        setCheckTitle((prevCheckTitle: boolean) => !prevCheckTitle);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [editorState, _id, session, updateData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (routerReclycle === false) {
        updateTitle(session, _id, value);
        setCheckTitle((prevCheckTitle: boolean) => !prevCheckTitle);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value, updateTitle]);


  return (
    <>
    <div  className={cn({
            [s.hide]: router.asPath.split("/")[1] === `${RECYCLE}`,
          })}>
    <div className={s.header_toolbar}>
      <div className={cn(s.toolbar_header_btns, s.toolbar)}></div></div>
   
      <div className={s.toolbar}>
     
        
          <ToolbarButtons
            code={code}
            setCode={setCode}
            modeCode={modeCode}
            editorState={editorState}
            setEditorState={setEditorState}
          />
       

        <div
          ref={refActiveMenu}
          className={cn(s.dropdown, {
            [s.recycleDots]: routerReclycle,
          })}
        >
          <button
            onClick={(e) => {
              setDotsMenuActive(!dotsMenuActive);
            }}
            className={cn(s.dropbtn, {
              [s.activeDots]: dotsMenuActive === true,
            })}
          >
            {" "}
            <DotsMenu />
          </button>
          <div
            id={s.myDropdown}
            className={cn(s.dropdown_content, {
              [s.show]: dotsMenuActive,
            })}
          >
            <div
              className={s.hide_btn}
              onClick={() => {
                hideLink(_id);
              }}
            >
              {" "}
              {!routerReclycle && btn_hide}{" "}
            </div>
            <ButtonDeleteNotes
              setDeleteElement={setDeleteElement}
              setLoadingDelete={setLoadingDelete}
              body={data}
            />
          </div>
        </div>
      </div>
</div>
      <WrapperEditorRecycle routerReclycle={routerReclycle}>
        <div>
          <div
            className={cn(s.body, {
              [s.block]: routerReclycle,
              [s.hideNote]: hideNotes ||  selectedItem.block === true && routerReclycle
            })}
          >
            <TextareaAutosize
              placeholder="Заголовок"
              value={value}
              className={cn(s.title, {
                [s.hideNote]: hideNotes ||  selectedItem.block === true && routerReclycle
              })}
              onChange={(e) => setValue(e.target.value)}
            />
            { code ? <pre className={cn('js',s.code_block)}>
          <code className={s.code}>
            <DraftTextForCode editorState={editorState}/>
            </code>
            </pre> : <Editor
              placeholder="Введите текст"
              editorKey="editor"
              editorState={editorState}
              onChange={handleEditorChange}
              handleKeyCommand={shortcutHandler(setEditorState)}
              keyBindingFn={getDefaultKeyBindingFn}
              blockStyleFn={blockStyleFn}
              customStyleMap={styleMap}
            />}
          </div>
        </div>
      </WrapperEditorRecycle>
    </>
  );
};

export default CustomEditor;
