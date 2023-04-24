import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react"

export default interface ButtonProps extends DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    icon_class?: string
    id_btn?: string,
    btn_class_format?: string,
    btn_class_option?: string,
    children: ReactNode
}