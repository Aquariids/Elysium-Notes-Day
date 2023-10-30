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
import WrapperEditorRecycle from "./WrapperEditorRecycle/WrapperEditorRecycle";
import { update_action } from "../../../pages/api/actios";
import { RECYCLE } from "../../../pages/api/paths";
import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";
hljs.registerLanguage("javascript", javascript);
import "highlight.js/styles/school-book.css";
import DraftTextForCode from "./DraftTextForCode/DraftTextForCode";
import Toolbar from "./Toolbar/Toolbar";
import { DateTime } from "luxon";
import { updateDateProps } from "./CustomEditor.props";
import DropdownMenuEditor from "../UI/DropdownMenu/DropdownMenu";
import ModalAddNotesInBook from "./ModalAddNotesInBook/ModalAddNotesInBook";
const CustomEditor = ({
  setCheckTitle,
  data,
  setDeleteElement,
  setLoadingDelete,
  selectedItem,
  updateBooks
  
}: any) => {
  const router = useRouter();
  const [previousEditorState, setPreviousEditorState] =
    useState<EditorState | null>(null);
  const [editorChanged, setEditorChanged] = useState<boolean>(false);
  const [value, setValue] = useState<string>(selectedItem.title);
  const [code, setCode] = useState<boolean>(selectedItem.code || false);
  const [updateDate, setUpdateDate] = useState<updateDateProps>( {
    updateDate: selectedItem.updateDate,
    dateFull:selectedItem.dateFull
    }
  );
  const { data: session } = useSession();
  const [showToolbar, setShowToolbar] = useState<boolean>(false);
  const [routerReclycle, setRouterReclycle] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState(false);
  useEffect(() => {
    hljs.highlightAll();
  }, [code]);


  const btn_hide = selectedItem.block ? <p className={s.text}>Показать заметку</p> : <p className={s.text}>Скрыть заметку</p>;

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const userDate = DateTime.now().setZone(userTimeZone);
  
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
    const contentState = convertFromRaw(JSON.parse(selectedItem.body)); // и теперь на основе нашего спец объекта мы создаем состояние редактора. Изначально оно пустое.
    return EditorState.createWithContent(contentState);
  });

  const editorStateMemo = useMemo(() => {
    const contentState = convertFromRaw(JSON.parse(selectedItem.body)); // тут мы парсим данные с базы в спец объект draft js
    return EditorState.createWithContent(contentState); // и на его основе меняем состояние редактора
  }, [selectedItem.body]);
  useEffect(() => {
    if (selectedItem.body) {
      setEditorState(editorStateMemo);
    }
  }, [selectedItem.body]);

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
          try {
            const updatedLink = { ...selectedItem, updateDate:userDate.toFormat("EEEE, d MMMM yyyyг, HH:mm") };
            const res = fetch(`/api/updateData?action=${update_action.update_date_last_changes}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updatedLink),
            });
          }
           catch(err) {
            console.log(err);
            
           }
         

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
 


  useEffect(() => {
    setValue(selectedItem.title);
  }, [selectedItem.title]);

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
        updateData(editorState, session, selectedItem._id);
        setCheckTitle((prevCheckTitle: boolean) => !prevCheckTitle);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [editorState, selectedItem._id, session, updateData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (routerReclycle === false) {
        updateTitle(session, selectedItem._id, value);
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
            hideNotes ={selectedItem.block}
            updateDate = {updateDate}
            showToolbar={showToolbar}
            code={code}
            setCode={setCode}
            modeCode={modeCode}
            editorState={editorState}
            setEditorState={setEditorState}
          />
        
          <DropdownMenuEditor activeModal={activeModal}  icon={<DotsMenu />}  >
          <div
                className={s.hide_btn}
                onClick={() => {
                  hideLink(selectedItem._id);
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
             {!routerReclycle && <p className={cn(s.text, s.hide_btn)} onClick={() => {setActiveModal(true)}}> Переместить.. </p>} 
          </DropdownMenuEditor>
          <ModalAddNotesInBook updateBooks={updateBooks} session={session} currentNote={selectedItem} active={activeModal} setActive={setActiveModal}/>
       
        </div>
      </div>
      <WrapperEditorRecycle routerReclycle={routerReclycle}>
        <div>
          <div 
         
           tabIndex={0}
            className={cn(s.body, {
              [s.hideNote]:
              selectedItem.block || (selectedItem.block === true && routerReclycle),
            })}
          >
            <TextareaAutosize
              placeholder="Заголовок"
              value={value}
              className={cn(s.title, {
                [s.block]: routerReclycle,
                [s.hideNote]:
                selectedItem.block || (selectedItem.block === true && routerReclycle),
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
