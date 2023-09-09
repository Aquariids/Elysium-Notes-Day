export interface ILinks {
    _id: string,
    title:string,
    date:string,
    body:string,
    userId:string,
    block: boolean,
    dateFull:string
}




export interface INotesList {
    body: ILinks[]
    checkTitle:any
}

