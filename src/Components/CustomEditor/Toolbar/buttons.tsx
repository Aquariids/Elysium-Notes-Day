import { isBlockquote, isBold, isH1, isH2, isH3, isH4, isH5, isH6,  isItalic, isLineThrough, isOL, isTextCenterAligned, isTextJustifyAligned, isTextLeftAligned, isTextRightAligned, isUL, isUnderline, toggleBlockquote, toggleBold, toggleH1, toggleH2, toggleH3, toggleH4, toggleH5, toggleH6, toggleHighlighter, toggleItalic, toggleLineThrough, toggleOL, toggleUL, toggleUnderline } from "contenido";
import * as Icons from "./icons";
import { buttonProps } from "./Toolbar.props";




export const headingButtons:buttonProps[] = [
    {
      name: "h1",
      handler: toggleH1,
      detector: isH1,
      children: <Icons.H1 />,
      title: "Заголовок 1",
    },
    {
      name: "h2",
      handler: toggleH2,
      detector: isH2,
      children: <Icons.H2 />,
      title: "Заголовок 2",
    },
    {
      name: "h3",
      handler: toggleH3,
      detector: isH3,
      children: <Icons.H3 />,
      title: "Заголовок 3",
    },
    {
      name: "h4",
      handler: toggleH4,
      detector: isH4,
      children: <Icons.H4 />,
      title: "Заголовок 4",
    },
    {
      name: "h5",
      handler: toggleH5,
      detector: isH5,
      children: <Icons.H5 />,
      title: "Заголовок 5",
    },
    {
      name: "h6",
      handler: toggleH6,
      detector: isH6,
      children: <Icons.H6 />,
      title: "Заголовк 6",
    },
  ];


export const alignmentButtons:buttonProps[] = [
    {
      name: "left",
      detector: isTextLeftAligned,
      children: <Icons.AlignLeft />,
      title: "Выравнивание по левому краю",
    },
    {
      name: "center",
      detector: isTextCenterAligned,
      children: <Icons.AlignCenter />,
      title: "Выравнивание по центру",
    },
    {
      name: "right",
      detector: isTextRightAligned,
      children: <Icons.AlignRight />,
      title: "Выравнивание по правому краю",
    },
    {
      name: "justify",
      detector: isTextJustifyAligned,
      children: <Icons.AlignJustify />,
      title: "Выравнивание по ширине",
    },
  ];


export const basicButtons:buttonProps[] = [
    {
      name: "bold",
      handler: toggleBold,
      detector: isBold,
      children: <Icons.Bold />,
      title: "Жирный",
    },
    {
      name: "Italic",
      handler: toggleItalic,
      detector: isItalic,
      children: <Icons.Italic />,
      title: "Курсив",
    },
    {
      name: "Underline",
      handler: toggleUnderline,
      detector: isUnderline,
      children: <Icons.Underline />,
      title: "Подчеркивание",
    },
    {
      name: "list-ul",
      handler: toggleUL,
      detector: isUL,
      children: <Icons.ListUl />,
      title: "Маркированный список",
    },
    {
      name: "list-ol",
      handler: toggleOL,
      detector: isOL,
      children: <Icons.ListOl />,
      title: "Нумерованный список",
    },
    {
      name: "blockQuote",
      handler: toggleBlockquote,
      detector: isBlockquote,
      children: <Icons.BlockQuote />,
      title: "Цитата",
    },
    {
      name: "strikethrough",
      handler: toggleLineThrough,
      detector: isLineThrough,
      children: <Icons.Strikethrough />,
      title: "Зачеркнутый",
    },
  ];