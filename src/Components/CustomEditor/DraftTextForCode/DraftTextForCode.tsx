import { EditorState } from "draft-js";
import {SandpackProvider, SandpackLayout, SandpackCodeViewer} from "@codesandbox/sandpack-react";
import { aquaBlue } from "@codesandbox/sandpack-themes";
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
    <div onClick={()=> {
      routerReclycle === false && setShowToolbar(true);
    }} >
      <SandpackProvider theme={aquaBlue} >
        <SandpackLayout>
          <SandpackCodeViewer code={ plainText}/>
        </SandpackLayout>
      </SandpackProvider>


    </div>
    
  );
};

export default DraftTextForCode;
