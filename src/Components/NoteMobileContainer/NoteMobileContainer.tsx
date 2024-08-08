import ModalBooks from "../CustomEditor/ModalBooks/ModalBooks";
import s from "./NoteMobileContainer.module.scss";
import cn from "classnames";
import Book from './book.svg';
const NoteMobileContainer = ({
  NotesList,
  // data_editor,
  loadingDelete,
  deleteElement,
  checkTitle,
  links,
  sort,
  sorting,
  user_id,
  setSort,
  HeaderNotes,
  showMobileNotesList,
  idpage,
  name,
  withoutId,
  handleCheckboxChange,
  setActiveModal,
 
  
}: any): JSX.Element => {
  return (
    <div
      className={cn(s.notes_list_mobile, {
        [s.show]: showMobileNotesList,
      })}
    >
      
      <HeaderNotes
        setSort={setSort}
        sort={sort}
        data={links ? links : ''}
      />

   
<p className={cn(s.nameBookMobile)}>
        <span onClick={() => setActiveModal(true)} className={s.tooltip}>
        <Book/>
         <span>{idpage === "all" ? "Всe" : name && name}</span>
        </span>
        {idpage === "all" && (
          <input
            title="Показать заметки без блокнотов"
            style={{ marginLeft: "5px" }}
            type="checkbox"
            checked={withoutId}
            onChange={handleCheckboxChange}
          />
        )}
      </p>
      <div className={s.container}>
        
        <div className={s.list}>
          
          {links[0] && (
            <>
            
              <NotesList
                deleteElement={deleteElement}
                loadingDelete={loadingDelete}
                checkTitle={checkTitle}
                dataClient={links ? sorting(links, sort) : ""}
                // dataServer={data_editor ? sorting(data_editor, sort) : ""}
                userId={user_id}
              />
              
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteMobileContainer;
