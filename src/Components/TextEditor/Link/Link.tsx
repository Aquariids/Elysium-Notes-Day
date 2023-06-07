import * as React from 'react';
import { useEditorApi } from '../context';
import { LinkProps } from '../TextEditor.props';

const Link: React.FC<LinkProps> = ({ contentState, entityKey, children }) => {
    const {setEntityData}:any = useEditorApi()
    const { url } = contentState.getEntity(entityKey).getData();

    const handlerClick = () => {
        const newUrl = prompt('URL:', url);
        if (newUrl) {
            setEntityData(entityKey, { url: newUrl });
        }
    }

    return (
        <a href={url} onClick={handlerClick}>
            {children}
        </a>
    );
}
export default Link;