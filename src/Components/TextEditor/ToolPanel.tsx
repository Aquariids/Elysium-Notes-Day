import * as React from 'react';
import cn from 'classnames';
import { useEditorApi } from './context';
import { InlineStyle } from './config';

const INLINE_STYLES_CODES = Object.values(InlineStyle);

const ToolPanel: React.FC = () => {
    const { toggleInlineStyle, hasInlineStyle,toHtml } = useEditorApi();


    const { addLink }: any = useEditorApi();

    const handlerAddLink = () => {
        const url = prompt('URL:');

        if (url) {
            addLink(url);
        }
    }
    return (

        <div className="tool-panel">
            <button onClick={toHtml}>Print</button>
            <button onClick={handlerAddLink}>
                Добавить ссылку
            </button>
            {INLINE_STYLES_CODES.map((code) => {
                const onMouseDown = (e: { preventDefault: () => void; }) => {
                    e.preventDefault();
                    toggleInlineStyle(code);
                };

                return (
                        <button
                            key={code}
                            className={cn(
                                "tool-panel__item",
                                hasInlineStyle(code) && "tool-panel__item_active"
                            )}
                            onMouseDown={onMouseDown}
                        >
                            {code}
                        </button>

                );
            })}
        </div>
    );
};

export default ToolPanel;