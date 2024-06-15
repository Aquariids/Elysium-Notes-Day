import React, { useEffect, useMemo, useState } from 'react';
import s from './NoteContainer.module.scss';
import Fuse from 'fuse.js';
import { EditorState, convertFromRaw } from 'draft-js';

const NoteContainer = ({
  NotesList,
  data_editor,
  loadingDelete,
  deleteElement,
  checkTitle,
  links,
  sort,
  sorting,
  user_id,
  setSort,
  HeaderNotes
}: any): JSX.Element => {
  console.log("🚀 ~ links:", links)
  const [filteredNotes, setFilteredNotes] = useState<object[]>([]);
  const [query, setQuery] = useState("");

  // Преобразуем body заметки в текст с помощью Draft.js
  const convertDraftToText = (body: string) => {
    try {
      const contentState = convertFromRaw(JSON.parse(body));
      const editorState = EditorState.createWithContent(contentState);
      return editorState.getCurrentContent().getPlainText();
    } catch (error) {
      console.error("Ошибка преобразования Draft.js:", error);
      return '';
    }
  };

  // Преобразуем заметки с Draft.js в текст для поиска
  const notesWithTextBody = useMemo(() => {
    return (links || data_editor).map((note: { body: string; }) => ({
      ...note,
      textBody: convertDraftToText(note.body), // Добавляем текстовое представление body
    }));
  }, [links, data_editor]);

  // Настраиваем Fuse.js для поиска по title и textBody
  const fuse = useMemo(() => {
    return new Fuse(notesWithTextBody, {
      keys: ["title", "textBody"], // Поиск по заголовку и преобразованному body
      includeScore: true,
      threshold: 0.2,
    });
  }, [notesWithTextBody]);

  // Фильтрация заметок с использованием Fuse.js
  useEffect(() => {
    if (query) {
      const results = fuse.search(query);
      setFilteredNotes(results.map((result):any => result.item));
    } else {
      setFilteredNotes(links || data_editor);
    }
  }, [query, fuse]);

  const data = () => {
    if (filteredNotes) {
      return filteredNotes;
    }
    return links || data_editor;
  };

  return (
    <div className={s.notes_list}>
      <HeaderNotes setSort={setSort} sort={sort} data={data()} />
      <input
        className={s.input}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск..."
      />
      <div className={s.container}>
        <div className={s.list}>
          {data_editor[0] && (
            <>
              <NotesList
                deleteElement={deleteElement}
                loadingDelete={loadingDelete}
                checkTitle={checkTitle}
                dataClient={sorting(filteredNotes, sort)}
                dataServer={sorting(data_editor, sort)}
                userId={user_id}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteContainer;
