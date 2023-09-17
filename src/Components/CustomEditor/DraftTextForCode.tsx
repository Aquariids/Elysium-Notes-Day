import { useEffect, useRef, useState } from "react";

const DraftTextForCode = ({editorState, setTest}:any) => {
      const refActiveMenu = useRef<HTMLDivElement>(null);

      const handleOutsideClick = () => {
            setTest(true);
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