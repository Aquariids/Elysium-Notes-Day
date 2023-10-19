import { ReactNode } from "react"

export interface DropdownMenuEditorProps {
    children: ReactNode
    icon: JSX.Element
    toolbarMainButton?:boolean
    highlighterButtons?:boolean
    tollbarActive?: boolean
    activeModal?: boolean
    style?: {
        dropdown?:string
        dropdown_content?:string
        dropbtn?:string
        active?:string
        show?:string
        

    } | any
}