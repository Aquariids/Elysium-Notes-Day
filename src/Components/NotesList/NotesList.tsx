import React, { useEffect, useMemo, useState } from "react";
import List from "./List";
import Fuse from "fuse.js";
const NotesList = ({
  dataClient,
  dataServer,
  userId,
  email,
  deleteElement,
  loadingDelete,
}: any) => {
 
  // const [notes, setNotes] = useState<{ title: string; body: string }[]>([...dataClient]);
  const [filteredNotes, setFilteredNotes] = useState<{  title: string; body: string }[]>([]);
  console.log("🚀 ~ filteredNotes:", filteredNotes)
  const [query, setQuery] = useState('');

  const fuse = useMemo(() => {
    return new Fuse(dataClient, {
      keys: ['title', 'body'], // Поиск по заголовку и содержимому body в текст надо будет превратить
      includeScore: true, // Включение рейтинга совпадений
      threshold: 0.3, // Чувствительность поиска (0.0 - точное совпадение, 1.0 - очень нечеткое)
    });
  }, [dataClient]);

  useEffect(() => {
    if (query) {
      const results = fuse.search(query);
      setFilteredNotes(results.map(result => result.item));
    } else {
      setFilteredNotes(dataClient);
    }

    
  }, [query, fuse]);

  if (!dataClient) {
    return(
    <>
     <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Поиск заметок..."
      />
       <List body={dataServer} userId={userId} email={email} />;
    </>
    )
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