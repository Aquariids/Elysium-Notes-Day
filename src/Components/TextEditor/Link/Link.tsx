import * as React from 'react';
import { LinkProps } from '../TextEditor.props';

const Link: React.FC<LinkProps> = ({contentState, entityKey, children}) => {
    const {url} = contentState.getEntity(entityKey).getData();

    return (
        <a href={url}>
            {children}
        </a>
    )
}

export default Link;