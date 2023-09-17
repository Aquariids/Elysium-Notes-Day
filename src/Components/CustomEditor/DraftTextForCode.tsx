import { useEffect, useRef } from "react";

const DraftTextForCode = ({editorState, setTest,routerReclycle}:any) => {
      console.log("🚀 ~ file: DraftTextForCode.tsx:4 ~ DraftTextForCode ~ routerReclycle:", routerReclycle)
      const refActiveMenu = useRef<HTMLDivElement>(null);

      const handleOutsideClick = (event:any) => {
        if (refActiveMenu.current && !refActiveMenu.current.contains(event.target)) {
          routerReclycle === false && setTest(true)
          
        }

          };
        
          useEffect(() => {
            document.addEventListener("click", handleOutsideClick, false);
          }, [editorState]);
        


      const plainText = editorState
      .getCurrentContent()
      .getPlainText()
return <div ref={refActiveMenu}>
{plainText}
</div>
}


export default DraftTextForCode;