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
import Modal from "./Modal";
import DotsMenu from "./dots.svg";
import ButtonDeleteNotes from "../ButtonDeleteNotes/ButtonDeleteNotes";
import { styleMap } from "./styleMap";
const CustomEditor = ({ id, body, title, setCheckTitle, data,setDeleteElement,setLoadingDelete }: any) => {
  const [dotsMenuActive, setDotsMenuActive] = useState<boolean>(false);
  const [value, setValue] = useState(title);
  const { data: session } = useSession();
  const _id = id;
  const router = useRouter();
  const [routerReclycle, setRouterReclycle] = useState<boolean>();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [display, setDisplay] = useState("none");
  const [isTimeoutInProgress, setIsTimeoutInProgress] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isClickBlocked, setIsClickBlocked] = useState(false);
  const refActiveMenu = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setRouterReclycle(router.asPath.split("/")[1] === "recycle");
  }, []);
  useEffect(()=> {
    const screenWidth = window.screen.width;
   const pageWidth = document.documentElement.scrollWidth; 
   console.log(pageWidth);
   
    
  })
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
        const response = await fetch(`/api/updateData`, {
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
        const response = await fetch(`/api/updateTitle`, {
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
      <div className={cn(s.toolbar, {
        [s.hide]:router.asPath.split("/")[1] === "recycle"
      })}>
        { router.asPath.split("/")[1] === "recycle" ? (
          ""
        ) : (
          <ToolbarButtons
            editorState={editorState}
            setEditorState={setEditorState}
          />
        )}
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
            <ButtonDeleteNotes  setDeleteElement={setDeleteElement} setLoadingDelete={setLoadingDelete} body={data} />
          </div>
        </div>
      </div>

      <div
        onMouseMove={() => {}}
        className={s.toolbar}
        onClick={(event) => {
          const { clientX, clientY } = event;
          setDisplay("flex");
          setIsAnimating(true);
          setIsTimeoutInProgress(true);
          if (!isClickBlocked) {
            setPosition({ x: clientX, y: clientY });
            setIsClickBlocked(true);
            setTimeout(() => {
              setDisplay("none");
              setIsAnimating(false);
              setIsTimeoutInProgress(false);
              setIsClickBlocked(false);
            }, 3000);
          }
        }}
      >
        {routerReclycle && (
          <Modal
            className={`${s.modal} ${isAnimating ? `${s.animated}` : ""}`}
            style={{
              display: display,
              position: "absolute",
              left: position.x,
              top: position.y,
            }}
          />
        )}

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
      </div>
    </>
  );
};

export default CustomEditor;
