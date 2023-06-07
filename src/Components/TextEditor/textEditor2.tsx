import React, { useState, useEffect } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import { useSession } from 'next-auth/react';

const emptyContentState = convertFromRaw({ // начальное состояние редактора
    entityMap: {},
    blocks: [
        {
            text: "",
            key: "foo",
            type: "unstyled",
            entityRanges: [],
        },
    ],
});
const DraftEditorRawExample = () => {
    const { data: session, status } = useSession();
    const [editorState, setEditorState] = useState(EditorState.createWithContent(emptyContentState));
    const userId = session?.user.userId;


    async function updateData() {
        const contentState = editorState.getCurrentContent();
        const dataRaw = convertToRaw(contentState);
        const data = {
            email: session?.user.email,
            userId: userId,
            body: dataRaw
        };
        const response = await fetch('/api/updateChek', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }
    useEffect(() => {
        const userId = session?.user.userId;
        fetch(`/api/chek?userId=${userId}`)
            .then((response) => response.json())
            .then((data) => {
                const contentState = convertFromRaw(data);
                setEditorState(EditorState.createWithContent(contentState));
            });
    }, [session]);


    const onChange = (editorState: any) => {
        const raw = convertToRaw(editorState.getCurrentContent());
        setEditorState(editorState);
    };
    const handleKeyCommand = (command: any) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            onChange(newState);
            return true;
        }
        return false;
    };
    const renderContentAsRawJs = () => {
        const contentState = editorState.getCurrentContent();
        const raw = convertToRaw(contentState);
        return JSON.stringify(raw, null, 2);
    };
    return (
        <div>
            <h4>Draft js editor</h4>
            <div className="editor-container">
                <Editor
                    // handleKeyCommand={handleKeyCommand}
                    editorState={editorState}
                    onChange={onChange}
                />
            </div>
            <h4>Editor content as raw JS</h4>
            <button onClick={updateData}> нажми </button>
            <pre>{renderContentAsRawJs()}</pre>
        </div>
    );
};
export default DraftEditorRawExample;