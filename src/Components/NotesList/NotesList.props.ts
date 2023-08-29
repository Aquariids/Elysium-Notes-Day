export interface ILinks {
    _id: string,
    title:string,
    date:string,
    body:string,
    userId:string,
    block: boolean
}




export interface INotesList {
    body: ILinks[]
    checkTitle:any
}

