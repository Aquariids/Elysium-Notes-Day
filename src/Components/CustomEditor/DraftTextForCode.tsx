const DraftTextForCode = ({editorState}:any) => {

      const plainText = editorState
      .getCurrentContent()
      .getPlainText()
return <>
{plainText}
</>
}


export default DraftTextForCode;