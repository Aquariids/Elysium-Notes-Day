import s from "./CustomEditor.module.scss";
import cn from "classnames";
const DraftTextForCode = ({
  editorState,
  setShowToolbar,
  routerReclycle,
}: any) => {


  const plainText = editorState.getCurrentContent().getPlainText();
  return (
    <pre onClick={()=> {
      routerReclycle === false && setShowToolbar(true);
    }} className={cn("js", s.code_block)}>
      <code className={s.code}>
        {plainText}
      </code>
    </pre>
  );
};

export default DraftTextForCode;
