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
import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";
hljs.registerLanguage("javascript", javascript);
import "highlight.js/styles/school-book.css";
import DraftTextForCode from "./DraftTextForCode";
import Toolbar from "./Toolbar/Toolbar";
const CustomEditor = ({
  id,
  body,
  title,
  setCheckTitle,
  data,
  setDeleteElement,
  setLoadingDelete,
  hideNotes,
  selectedItem,
}: any) => {
  const [previousEditorState, setPreviousEditorState] =
    useState<EditorState | null>(null);
  const [editorChanged, setEditorChanged] = useState(false);
  const [dotsMenuActive, setDotsMenuActive] = useState<boolean>(false);
  const [value, setValue] = useState(title);
  const [code, setCode] = useState(selectedItem.code || false);
  const { data: session } = useSession();
  const [showToolbar, setShowToolbar] = useState(false);
  const _id = id;
  const router = useRouter();
  const [routerReclycle, setRouterReclycle] = useState<boolean>();
  useEffect(() => {
    hljs.highlightAll();
  }, [code]);
  const refActiveMenu = useRef<HTMLDivElement>(null);

  const btn_hide = hideNotes ? <p className={s.text}>Показать заметку</p> : <p className={s.text}>Скрыть заметку</p>;


  async function hideLink(currentLink: string) {
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
          console.error("Failed to update");
        }
      } catch (error) {
        alert("Failed to update note")
        console.error(error);
      }
    } else {
      console.error("Link does not exist");
    }
  }

  async function modeCode() {
    if (selectedItem) {
      const updatedLink = { ...selectedItem, code: !code };
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
        alert("Failed to update")
        console.error(error);
      }
    } else {
      console.error("Link does not exist");
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
    (editorState: SetStateAction<EditorState | any>) => {
      // Сравниваем текущее состояние с предыдущим состоянием
      // equals сравнивает contentState
  
      if (
        !previousEditorState ||
        !editorState
          .getCurrentContent()
          .equals(previousEditorState.getCurrentContent())
      ) {
        // Здесь регистрируем изменение
        setShowToolbar(true);
        

        if (editorChanged) {
          console.log("Текст был изменен");
        } else {
          // Редактор был изменен после инициализации
          setEditorChanged(true);
        }
      }

      //  текущее состояние в предыдущее состояние
      setPreviousEditorState(editorState);
      //  текущее состояние редактора
      setEditorState(editorState);
    },
    [previousEditorState, editorChanged]
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
    async (editorState: EditorState, session: any, _id: string) => {
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
        alert("Failed to update note")
        console.error(error);
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
        alert("Failed to update note")
        console.error(error);
        
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
      <div>
        <div className={s.toolbar}>
          <Toolbar
            showToolbar={showToolbar}
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
              [s.hideNote]:
                hideNotes || (selectedItem.block === true && routerReclycle),
            })}
          >
            <TextareaAutosize
              placeholder="Заголовок"
              value={value}
              className={cn(s.title, {
                [s.block]: routerReclycle,
                [s.hideNote]:
                  hideNotes || (selectedItem.block === true && routerReclycle),
              })}
              onChange={(e) => setValue(e.target.value)}
            />
            {code ? (
              
                  <DraftTextForCode
                    editorState={editorState}
                    setShowToolbar={setShowToolbar}
                    routerReclycle={routerReclycle}
                  />
                
            ) : (
              <div className={cn({ [s.block]: routerReclycle })}>
                <Editor
                  placeholder='...Введите текст'
                  editorKey="editor"
                  editorState={editorState}
                  onChange={handleEditorChange}
                  handleKeyCommand={shortcutHandler(setEditorState)}
                  keyBindingFn={getDefaultKeyBindingFn}
                  blockStyleFn={blockStyleFn}
                  customStyleMap={styleMap}
                />
              </div>
            )}
          </div>
        </div>
      </WrapperEditorRecycle>
    </>
  );
};

export default CustomEditor;
