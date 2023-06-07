import { convertFromRaw, DraftEditorCommand, DraftEntityMutability, EditorState, KeyBindingUtil, RawDraftContentState, RichUtils, getDefaultKeyBinding } from 'draft-js';
import * as React from 'react';
import { BlockType, EntityType, InlineStyle } from './config';
import { EditorApi } from './TextEditor.props';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { CompositeDecorator } from 'draft-js';
import LinkDecorator from './Link';
import { HTMLtoState, stateToHTML } from './convert';
const emptyContentState: RawDraftContentState = {
    blocks: [
        {
            text: '',
            key: 'foo',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
        },
    ],
    entityMap: {},
};

const decorator = new CompositeDecorator([LinkDecorator]);
console.log("(👍≖‿‿≖)👍 ✿ file: useEditor.tsx:23 ✿ decorator:", decorator)

export const useEditor = (html?: string): EditorApi => {
    const { data: session, status } = useSession();
    const userId = session?.user.userId;
    const [state, setState] = React.useState(() => EditorState.createWithContent(convertFromRaw(emptyContentState)));
    // const [state, setState] = React.useState(() => EditorState.createEmpty());

    React.useEffect(() => {
        const newEditorState = EditorState.set(state, { decorator });
        setState(newEditorState);
    }, [decorator]);

    const addEntity = React.useCallback((entityType: EntityType, data: Record<string, string>, mutability: DraftEntityMutability) => {
        setState((currentState) => {
            /* Получаем текущий контент */
            const contentState = currentState.getCurrentContent();
            /* Создаем Entity с данными */
            const contentStateWithEntity = contentState.createEntity(entityType, mutability, data);
            /* Получаем уникальный ключ Entity */
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
            /* Обьединяем текущее состояние с новым */
            const newState = EditorState.set(currentState, { currentContent: contentStateWithEntity });
            /* Вставляем ссылку в указанное место */
            return RichUtils.toggleLink(newState, newState.getSelection(), entityKey);
        })
    }, []);

    const setEntityData = React.useCallback((entityKey: any, data: any) => {
        setState((currentState) => {
            /* Получаем текущий контент */
            const content = currentState.getCurrentContent();
            /* Объединяем текущие данные Entity с новыми */
            const contentStateUpdated = content.mergeEntityData(
                entityKey,
                data,
            )
            /* Обновляем состояние редактора с указанием типа изменения */
            return EditorState.push(currentState, contentStateUpdated, 'apply-entity');
        })
    }, [])


    const toHtml = React.useCallback(() => {
        return stateToHTML(state.getCurrentContent());
    }, [state]);

    // const [state, setState] = React.useState(() =>
    //     html
    //         ? EditorState.createWithContent(HTMLtoState(html), decorator)
    //         : EditorState.createEmpty(decorator)
    // );

    const handlerKeyBinding = React.useCallback((e: React.KeyboardEvent) => {
        /* Проверяем нажата ли клавиша q + ctrl/cmd */
        if (e.keyCode === 81 && KeyBindingUtil.hasCommandModifier(e)) {
            return 'accent';
        }

        return getDefaultKeyBinding(e);
    }, []);


    const handleKeyCommand = React.useCallback((command: DraftEditorCommand | 'accent', editorState: EditorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);

        if (newState) {
            setState(newState);
            return 'handled';
        }

        if (command === "accent") {
            toggleInlineStyle(InlineStyle.ACCENT);
            return 'handled';
        }

        return 'not-handled';
    }, []);




    const addLink = React.useCallback((url: any) => {
        addEntity(EntityType.link, { url }, 'MUTABLE')
    }, [addEntity]);
    // const getDataFromBd = async () => {
    //     fetch(`/api/chek?userId=${userId}`).then(response => response.json())
    //         .then(rawContent => {
    //             if (rawContent) {
    //                 setState(EditorState.createWithContent(convertFromRaw(rawContent)))
    //             } else {
    //                 setState(EditorState.createWithContent(emptyContentState))
    //             }
    //         })

    // }
    const toggleBlockType = React.useCallback((blockType: BlockType) => {
        setState((currentState) => RichUtils.toggleBlockType(currentState, blockType))
    }, []);
    const toggleInlineStyle = React.useCallback((inlineStyle: InlineStyle) => {
        setState((currentState) => RichUtils.toggleInlineStyle(currentState, inlineStyle))
    }, []);

    const currentBlockType = React.useMemo(() => {
        /* Шаг 1 */
        const selection = state.getSelection();
        /* Шаг 2 */
        const content = state.getCurrentContent();
        /* Шаг 3 */
        const block = content.getBlockForKey(selection.getStartKey());
        /* Шаг 4 */
        return block.getType() as BlockType;
    }, [state]);

    const hasInlineStyle = React.useCallback((inlineStyle: InlineStyle) => {
        /* Получаем иммутабельный Set с ключами стилей */
        const currentStyle = state.getCurrentInlineStyle();
        /* Проверяем содержится ли там переданный стиль */
        return currentStyle.has(inlineStyle);
    }, [state]);

    return React.useMemo(() => ({
        setEntityData,
        toHtml,
        handlerKeyBinding,
        handleKeyCommand,
        addLink,
        currentBlockType,
        toggleBlockType,
        hasInlineStyle,
        toggleInlineStyle,
        state,
        onChange: setState
    }), [state])
}


