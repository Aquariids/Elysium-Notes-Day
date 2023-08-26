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
const CustomEditor = ({
  id,
  body,
  title,
  setCheckTitle,
  data,
  setDeleteElement,
  setLoadingDelete,
}: any) => {
  const [dotsMenuActive, setDotsMenuActive] = useState<boolean>(false);
  const [value, setValue] = useState(title);
  const { data: session } = useSession();
  const _id = id;
  const router = useRouter();
  const [routerReclycle, setRouterReclycle] = useState<boolean>();
  const refActiveMenu = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setRouterReclycle(router.asPath.split("/")[1] === `${RECYCLE}`);
  }, []);
  useEffect(() => {
    const screenWidth = window.screen.width;
    const pageWidth = document.documentElement.scrollWidth;
    console.log(pageWidth);
  });
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
        const response = await fetch(`/api/updateData?action=${update_action.editor}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
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
        const response = await fetch(`/api/updateData?action=${update_action.editor_title}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      } catch (error) {
        alert(error);
      }
    },
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      updateData(editorState, session, _id);
      setCheckTitle((prevCheckTitle: boolean) => !prevCheckTitle);
    }, 300);

    return () => clearTimeout(timer);
  }, [editorState, _id, session, updateData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateTitle(session, _id, value);
      setCheckTitle((prevCheckTitle: boolean) => !prevCheckTitle);
    }, 300);

    return () => clearTimeout(timer);
  }, [value, updateTitle]);

  return (
    <>
      <div className={s.toolbar}>
        <div
          className={cn({
            [s.hide]: router.asPath.split("/")[1] === `${RECYCLE}`,
          })}
        >
          <ToolbarButtons
            editorState={editorState}
            setEditorState={setEditorState}
          />
        </div>

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
            className={s.dropbtn}
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
            <ButtonDeleteNotes
              setDeleteElement={setDeleteElement}
              setLoadingDelete={setLoadingDelete}
              body={data}
            />
          </div>
        </div>
      </div>

      <WrapperEditorRecycle routerReclycle={routerReclycle}>
        <div>
          <div
            className={cn(s.body, {
              [s.block]: routerReclycle,
            })}
          >
            <TextareaAutosize
              placeholder="Заголовок"
              value={value}
              className={s.title}
              onChange={(e) => setValue(e.target.value)}
            />

            <Editor
              placeholder="Введите текст"
              editorKey="editor"
              editorState={editorState}
              onChange={handleEditorChange}
              handleKeyCommand={shortcutHandler(setEditorState)}
              keyBindingFn={getDefaultKeyBindingFn}
              blockStyleFn={blockStyleFn}
              customStyleMap={styleMap}
            />
          </div>
        </div>
      </WrapperEditorRecycle>
    </>
  );
};

export default CustomEditor;
