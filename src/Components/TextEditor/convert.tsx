import { convertFromHTML, convertToHTML } from 'draft-convert';
import { CUSTOM_STYLE_MAP, BlockType, EntityType, InlineStyle } from './config';

export const stateToHTML = convertToHTML<InlineStyle, BlockType>({
    styleToHTML: (style) => {
        switch (style) {
            case InlineStyle.BOLD:
                return <strong />;
            case InlineStyle.ACCENT:
                return <span className="accent" style={CUSTOM_STYLE_MAP[InlineStyle.ACCENT]} />;
            default:
                return null;
        }
    },
    blockToHTML: (block) => {
        switch (block.type) {
            case BlockType.h1:
                return <h1 />;
            case BlockType.default:
                return <p />;
            default:
                return null;
        }
    },
    entityToHTML: (entity, originalText) => {
        if (entity.type === EntityType.link) {
            return (
                <a href={entity.data.url}>
                    {originalText}
                </a>
            );
        }
        return originalText;
    },
});


export const HTMLtoState = convertFromHTML<DOMStringMap, BlockType>({
    htmlToStyle: (nodeName, node, currentStyle) => {
        if (nodeName === 'strong') {
            return currentStyle.add(InlineStyle.BOLD);
        }
      if(nodeName === 'span' && node.classList.contains('accent')) {
        return currentStyle.add(InlineStyle.ACCENT);
      }

return currentStyle;
    },
htmlToBlock(nodeName, node) {
    switch (nodeName) {
        case 'h1':
            return BlockType.h1;
        case 'div':
        case 'p':
            return BlockType.default;
        default:
            return null;
    }
},
htmlToEntity: (nodeName, node, createEntity) => {
    if (nodeName === 'a' && node.href) {
        return createEntity(EntityType.link, 'MUTABLE', { url: node.href });
    }

    return undefined;

},
  });