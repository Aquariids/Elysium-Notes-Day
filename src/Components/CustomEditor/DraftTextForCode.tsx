import { useEffect, useRef, useState } from "react";

const DraftTextForCode = ({editorState, setTest}:any) => {
      const refActiveMenu = useRef<HTMLDivElement>(null);

      const handleOutsideClick = (event:any) => {
        if (
          refActiveMenu.current &&
          !refActiveMenu.current.contains(event.target)
        ) {
          setTest(true)
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