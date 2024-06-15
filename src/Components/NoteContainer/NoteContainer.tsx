import { useEffect, useMemo, useState } from 'react';
import s from './NoteContainer.module.scss';
import Fuse from 'fuse.js';


const NoteContainer = ({NotesList,data_editor,loadingDelete,deleteElement,checkTitle,links,sort,sorting,user_id,setSort, HeaderNotes }:any):JSX.Element => {
  console.log("🚀 ~ NoteContainer ~ sort:", sort)
  const [filteredNotes, setFilteredNotes] = useState<object>([]);
  const [query, setQuery] = useState("");

  const fuse = useMemo(() => {
    return new Fuse(links ? links: data_editor, {
      keys: ["title"], // Поиск по заголовку и содержимому body в текст надо будет преварить
      includeScore: true, // Включение рейтинга совпадений
      threshold: 0.3, // Чувствительность поиска (0.0 - точное совпадение, 1.0 - очень нечеткое)
    });
  }, [links]);

  const data = () => {
    if(filteredNotes) {
      return filteredNotes;
    }
     else if (links) {
      return links;
     }
     else {
      return data_editor
     }
  }

  useEffect(() => {
    if (query) {
      const results = fuse.search(query);
      setFilteredNotes(results.map((result) => result.item));
    } else {
      setFilteredNotes(links);
    }
  }, [query, fuse]);

return  (

<div className={s.notes_list}>
         <HeaderNotes setSort={setSort} sort={sort} data={data()} />
         <input
          className={s.input}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск заметок..."
        />
          <div className={s.container}>
         
            <div className={s.list}>
              {data_editor[0] && (
                 <>
              
       
                 <NotesList
  
                  deleteElement={deleteElement}
                  loadingDelete={loadingDelete}
                  checkTitle={checkTitle}
                  dataClient={links ? sorting(filteredNotes, sort) : ""}
                  dataServer={data_editor ? sorting(data_editor, sort) : ""}
                  userId={user_id}
                />
                </>
              )}

            </div>
          </div>
        </div>

)

}

export default NoteContainer;