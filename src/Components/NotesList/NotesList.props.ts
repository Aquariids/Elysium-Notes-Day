export interface ILinks {
    _id: string,
    title:string,
    date:string,
    body:string,
    userId:string
}




export interface INotesList {
    body: ILinks[]
    checkTitle:any
}




import { EditorState, convertFromRaw } from "draft-js";

export const DraftJsObjectInText = (body:string) => {
    const contentState = convertFromRaw(JSON.parse(body));
    const editorState = EditorState.createWithContent(contentState);
    const plainText = editorState.getCurrentContent().getPlainText().toLowerCase()
    
    if(plainText.length >= 130) {
      const text = plainText.slice(0, 130) + '...'
      return text;
    } else {
      return plainText
    }
    
  }
 export const sliceTitle = (title:string) => {
    if(title.length >= 30) {
      const text = title.slice(0, 30) + '...';
      return text;
    } else {
      return title
    }
    
  }
  