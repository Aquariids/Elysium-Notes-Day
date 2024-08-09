import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface ButtonDeleteProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
all_id: string[]
setDeleteElement?: any
setLoadingDelete?:any
currentNote?:notes_data,
}

export interface DeleteLinkProps {
    linkId?: string | string[];
    recycle?: boolean;
    restore?: true;
  }
