import * as React from "react";
import ITextEditorProps from './TextEditor.props'
import s from './TextEditor.module.scss';
const TextEditor: React.FunctionComponent<ITextEditorProps> = (props) => {
  return (

    <div className={s.container}>
        <div className={s.options}>
            <button id="bold" className={s.option_button }></button>
        </div>
    </div>
  )
};

export default TextEditor;
