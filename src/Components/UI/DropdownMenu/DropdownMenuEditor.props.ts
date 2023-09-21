import { ReactNode } from "react"

export interface DropdownMenuEditorProps {
    children: ReactNode
    icon: JSX.Element
    routerReclycle?:boolean
    toolbarMainButton?:boolean
    highlighterButtons?:boolean
    colorHighlighter?:string
    tollbarActive?: boolean
    style?: {
        dropdown:string
        dropdown_content:string
        dropbtn:string
        active:string
        show:string
        

    } | any
}