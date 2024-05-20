import { EditorState } from "draft-js";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeViewer,
} from "@codesandbox/sandpack-react";
import { aquaBlue } from "@codesandbox/sandpack-themes";
import { gruvboxDark } from "@codesandbox/sandpack-themes";
interface props {
  editorState: EditorState;
  setShowToolbar: (value: boolean) => void;
  routerReclycle: boolean;
}


// это компонент для мод кода на сайте.
// тут я получаю тело документа обычным текстом и оборачиваю его sandbox, но без песочницы, просто для отображения красивого синтаксиса
// таким образом на сайте можно делать заметки с кодом и будет все понятно и красиво. Конечно пока что вся заметка будет оборачиваться, а не выделенная часть
// это нужно будет решить как то в будущем.
const Sandpack = ({
  editorState,
  setShowToolbar,
  routerReclycle,
}: props) => {
  const plainText = editorState.getCurrentContent().getPlainText();
  
  
  
  return (
    <SandpackProvider theme={aquaBlue}>
      <SandpackLayout
        onClick={() => {
          routerReclycle === false && setShowToolbar(true);
        }}
      >
        <SandpackCodeViewer code={plainText} />
      </SandpackLayout>
    </SandpackProvider>
  );
};

export default Sandpack;
