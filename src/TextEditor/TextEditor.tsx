import * as React from "react";
import ITextEditorProps from './TextEditor.props'
import s from './TextEditor.module.scss';
const TextEditor: React.FunctionComponent<ITextEditorProps> = (props) => {
    let className = s.option_button + ' ' + s.format;

  return (

    <div className={s.container}>
        <div className={s.options}>
            <button id={s.bold} className={ className }>
            <i className="fa-solid fa-bold">Привет привет, как дела ты тут, да?</i>
            </button>
        </div>
    </div>
  )
};

export default TextEditor;
