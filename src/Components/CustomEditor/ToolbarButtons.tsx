import { isBold, isItalic, isUnderline, toggleBold, toggleItalic, toggleUnderline, toggleSub, isSub, toggleH1, isH1,toggleUL, isUL, toggleInlineStyle, hasInlineStyleOf, initialStyleMap} from "contenido";
import { EditorStateProps } from "./CustomEditor.props";
import cn from 'classnames';
import s from './CustomEditor.module.scss';
import ToolbarButton from "../UI/ToolbarButton/ToolbarButton";
import Bold from './icons/bold.svg';


const toolbarButtons = [
  { name:  'bold', handler: toggleBold, detector: isBold },
  { name: "Italic", handler: toggleItalic, detector: isItalic },
  { name: "Underline", handler: toggleUnderline, detector: isUnderline },
  { name: 'Список', handler: toggleUL, detector:isUL },
  { name: 'h1', handler: toggleH1, detector:isH1 },
];

const ToolbarButtons = ({editorState, setEditorState}:EditorStateProps) => {
  const COLORIZE  = 'COLORIZE';

  const toggleColorize = () =>
    toggleInlineStyle(editorState, setEditorState, COLORIZE);
    const isColorize = () => hasInlineStyleOf(editorState, COLORIZE);
    
  return (
    <>

  
        <ToolbarButton
        onMouseDown={(e) => {
          e.preventDefault();
          toggleColorize();
        }}
        style={{
          color: isColorize() ? 'white' : '#4cb5f5',
          backgroundColor: isColorize() ? '#4cb5f5' : 'white',
        }}
      >
        Colorize
      </ToolbarButton>

      {toolbarButtons.map((btn) => (
        <ToolbarButton
          name= {btn.name}
          key={btn.name}
          onMouseDown={(e) => {
            e.preventDefault();
            btn.handler(editorState, setEditorState);
          }}
          style={{
            color: btn.detector(editorState) ? "skyblue" : "black",
          }}
        >
          {btn.name}
        </ToolbarButton>
      ))}
    </>
  );
};


export default ToolbarButtons;