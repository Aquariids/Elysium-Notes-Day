import s from './NoteMobileContainer.module.scss';
import cn from 'classnames';

const NoteMobileContainer = ({NotesList,data_editor,loadingDelete,deleteElement,checkTitle,links,sort,sorting,user_id,setSort, HeaderNotes, showMobileNotesList }:any):JSX.Element => {

    return (
        <div className={cn(s.notes_list_mobile,{
            [s.show]:showMobileNotesList,
        })}>
        <HeaderNotes setSort={setSort} sort={sort} data={links ? links : data_editor} />
         <div className={s.container}>
           <div className={s.list}>
             {data_editor[0] && (
                <>
                <NotesList
 
                 deleteElement={deleteElement}
                 loadingDelete={loadingDelete}
                 checkTitle={checkTitle}
                 dataClient={links ? sorting(links, sort) : ""}
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


export default NoteMobileContainer;