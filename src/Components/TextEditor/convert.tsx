import { CUSTOM_STYLE_MAP, BlockType, EntityType, InlineStyle } from './config';

export const stateToHTML = convertToHTML<InlineStyle, BlockType>({
    styleToHTML: (style) => {
        switch (style) {
            case InlineStyle.BOLD:
                return <strong />;
      ...
      case InlineStyle.ACCENT:
    return<span className = "accent" style = {CUSTOM_STYLE_MAP[InlineStyle.ACCENT]} />;
      default:
return null;
    }
  },
blockToHTML: (block) => {
    switch (block.type) {
        case BlockType.h1:
            return <h1 />;
        ...
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