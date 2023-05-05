import * as React from 'react';
import { EditorApi, ITextContextEditor } from './TextEditor.props';
import { useEditor } from './useEditor';

const TextEditorContext = React.createContext<EditorApi | undefined>(undefined);

export const useEditorApi = () => {
    const context = React.useContext(TextEditorContext);
    if (context === undefined) {
        throw new Error('useEditorApi must be used within TextEditorProvider');
    }

    return context;
}

export const TextEditorProvider: React.FC<ITextContextEditor> = ({ children }) => {
    const editorApi = useEditor();

    return (
        <TextEditorContext.Provider value={editorApi}>
            {children}
        </TextEditorContext.Provider>
    )
}