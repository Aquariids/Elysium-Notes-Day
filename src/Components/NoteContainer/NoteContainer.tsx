import React, { useEffect, useMemo, useState } from 'react';
import s from './NoteContainer.module.scss';
import Fuse from 'fuse.js';
import { EditorState, convertFromRaw } from 'draft-js';
import cn from 'classnames';
import { useAllNotes } from '../../../hooks/useAllNotes';
import { useCurrentIdPage } from '../../../hooks/useCurrentIdPage';

const NoteContainer = ({
  NotesList,
  loadingDelete,
  deleteElement,
  checkTitle,
  sort,
  sorting,
  user_id,
  setSort,
  email,
  without_id,
  idPage,
  HeaderNotes
}: any): JSX.Element => {
  console.log("🚀 ~ idPage:", idPage)
  const [filteredNotes, setFilteredNotes] = useState<object[]>([]);
  const [query, setQuery] = useState("");

  const { notes, isLoading, isError,mutate} = useAllNotes(user_id, email, without_id,idPage);
  


  // Преобразуем body заметки в текст с помощью Draft.js
  const convertDraftToText = (body: string) => {

    if(!body) return '';

    try {
      const contentState = convertFromRaw(JSON.parse(body));
      let plainText = contentState.getPlainText('\n');
      
      // Удаляем избыточные пробелы и специальные символы
      plainText = plainText.replace(/\s+/g, ' ').trim();
      
      return plainText;
    } catch (error) {
      console.error("Ошибка преобразования Draft.js:", error);
      return '';
    }
  };

  // Преобразуем заметки с Draft.js в текст для поиска
  const notesWithTextBody = useMemo(() => {
    if (!notes || notes.length === 0) {
      return [];
    }
    return (notes).map((note: { body: string; }) => ({
      ...note,
      textBody: convertDraftToText(note.body), // Добавляем текстовое представление body
    }));
  }, [notes]);
  // Настраиваем Fuse.js для поиска по title и textBody
  const fuse = useMemo(() => {
    return new Fuse(notesWithTextBody, {
      keys: ["title", "textBody"], // Поиск по заголовку и преобразованному body
      includeScore: true,
      threshold: 0.2,
      distance: 1000000,
    });
  }, [notesWithTextBody]);


  // Фильтрация заметок с использованием Fuse.js
  useEffect(() => {
    if (query) {
      const results = fuse.search(query);
      setFilteredNotes(results.map((result):any => result.item));
    } else {
      setFilteredNotes(notes || []);
    }
  }, [query, fuse]);

  const data = () => {
    if (filteredNotes) {
      return filteredNotes;
    }
    return notes;
  };

  useEffect(() => {
    mutate(); 
  }, [notes]);

  return (
    <div className={s.notes_list}>
      <HeaderNotes setSort={setSort} sort={sort} data={data()} />
      <input
        className={cn(s.input, {
        [s.fullInput]: query
        })}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск..."
      />
      <div className={s.container}>
        <div className={s.list}>
          {notes && (
            <>
              <NotesList
                deleteElement={deleteElement}
                loadingDelete={loadingDelete}
                checkTitle={checkTitle}
                dataClient={sorting(filteredNotes, sort)}
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
