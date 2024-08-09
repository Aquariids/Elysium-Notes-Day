export interface ILinks {
    _id: string,
    title:string,
    date:string,
    body:string,
    userId:string,
    block: boolean,
    dateFull:string,
    dateShort:string
}




export interface INotesList {
    dataClient:notes_data,
  userId?:string
  email?:string
  deleteElement?:string,
  loadingDelete?:boolean
}

