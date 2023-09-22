import { EditorState } from "draft-js";
import s from "../CustomEditor.module.scss";
import cn from "classnames";

interface props {
  editorState:EditorState,
  setShowToolbar: (value: boolean) => void
  routerReclycle: boolean
}
const DraftTextForCode = ({
  editorState,
  setShowToolbar,
  routerReclycle,
}: props) => {


  const plainText = editorState.getCurrentContent().getPlainText();
  return (
    <pre onClick={()=> {
      routerReclycle === false && setShowToolbar(true);
    }} className="js">
      <code className={s.code}>
        {plainText}
      </code>
    </pre>
  );
};

export default DraftTextForCode;
