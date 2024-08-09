const remove_line_break = (str: string) => {
    return str.replace(/\n/g, "");
  };

const DraftJsObjectInText = (body: string) => {
    const contentState = convertFromRaw(JSON.parse(body));
    const editorState = EditorState.createWithContent(contentState);
    const plainText = editorState
      .getCurrentContent()
      .getPlainText()
      .toLowerCase();

    const sizeText = router.asPath === "/" ? 100 : 85;

    if (plainText.length >= sizeText) {
      const text = plainText.slice(0, sizeText) + "...";
      return text;
    } else {
      return remove_line_break(plainText);
    }
  };

  const sliceTitle = (title: string) => {
    const sizeTitle = router.asPath === "/" ? 10 : 25;
    if (title.length >= sizeTitle) {
      const text = title.slice(0, sizeTitle) + "...";
      return remove_line_break(text);
    } else {
      return remove_line_break(title);
    }
  };

  const bodyTextsCache = useMemo(() => new Map(), []);
  const TitleTextsCache = useMemo(() => new Map(), []);
  const getCachedText = useCallback(
    (body: string) => {
      if (!bodyTextsCache.has(body)) {
        const text = DraftJsObjectInText(body);
        bodyTextsCache.set(body, text);
      }
      return bodyTextsCache.get(body);
    },
    [bodyTextsCache]
  );

  const getCachedTextTitle = useCallback(
    (title: string) => {
      if (!TitleTextsCache.has(title)) {
        const text = sliceTitle(title);
        TitleTextsCache.set(title, text);
      }
      return TitleTextsCache.get(title);
    },
    [TitleTextsCache]
  );