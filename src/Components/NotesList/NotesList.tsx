import React, { useEffect, useMemo, useState } from "react";
import List from "./List";
import Search from "../Search/Search";
import Fuse from "fuse.js";
const NotesList = ({
  dataClient,
  dataServer,
  userId,
  email,
  deleteElement,
  loadingDelete,
}: any) => {
 
  const [notes, setNotes] = useState<{ _id: string; title: string; body: string }[]>([...dataClient]);
  const [filteredNotes, setFilteredNotes] = useState<{ _id: string; title: string; body: string }[]>([]);
  const [query, setQuery] = useState('');

  const fuse = useMemo(() => {
    return new Fuse(notes, {
      keys: ['title', 'body'], // Поиск по заголовку и содержимому
      includeScore: true, // Включение рейтинга совпадений
      threshold: 0.3, // Чувствительность поиска (0.0 - точное совпадение, 1.0 - очень нечеткое)
    });
  }, [notes]);

  useEffect(() => {
    if (query) {
      const results = fuse.search(query);
      setFilteredNotes(results.map(result => result.item));
    } else {
      setFilteredNotes(notes);
    }

    
  }, [query, fuse]);

  if (!dataClient) {
    return <List body={dataServer} userId={userId} email={email} />;
  } else {
    
    return (
      <>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Поиск заметок..."
      />
      <List
        loadingDelete={loadingDelete}
        deleteElement={deleteElement}
        body={filteredNotes}
        userId={userId}
        email={email}
      />
      </>
    );
  }
};

export default NotesList;