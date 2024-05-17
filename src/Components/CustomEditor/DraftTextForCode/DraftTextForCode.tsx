import { EditorState } from "draft-js";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeViewer,
} from "@codesandbox/sandpack-react";
import { aquaBlue } from "@codesandbox/sandpack-themes";
import DOMPurify from 'dompurify';
interface props {
  editorState: EditorState;
  setShowToolbar: (value: boolean) => void;
  routerReclycle: boolean;
}

const DraftTextForCode = ({
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

export default DraftTextForCode;
