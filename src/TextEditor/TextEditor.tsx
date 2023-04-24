import * as React from "react";
import ITextEditorProps from './TextEditor.props';
import cn from 'classnames';
import s from './TextEditor.module.scss';
import Icon from "./Icon/Icon";
import Button from "./Button/Button";
import { useState } from "react";

const TextEditor: React.FunctionComponent<ITextEditorProps> = (props) => {

  const [isBold, setIsBold] = useState(false);


  const handleBoldClick = () => {
  }
  return (

    <div className={s.container}>
      <div className={s.options}>
        <Button onClick={handleBoldClick}>
          <Icon id="bold" icon="bold" />
        </Button>
        <div id={s.text_input} contentEditable="true"></div>
      </div>
    </div>
  )
};

export default TextEditor;

