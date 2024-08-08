import useSWR from "swr";
import { get_action } from "../pages/api/actions";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useAllNotes(userId: string, email: string, withoutId: boolean) {

  if(!withoutId) {
    const { data, error } = useSWR(
      `/api/getData?action=${get_action.get_all_user_notes}&userId=${userId}&email=${email}`,
       fetcher
     );
   
     return {
       notes: data,
       isLoading: !error && !data,
       isError: error,
     };
  }

  if(withoutId) {
    const { data, error } = useSWR(
      `/api/getData?action=${get_action.get_all_user_notes_without_id}&userId=${userId}&email=${email}`,
       fetcher
     );
   
     return {
       notes: data,
       isLoading: !error && !data,
       isError: error,
     };
  }

  else return {
    notes: <></>,
    isLoading: <></>,
    isError: <></>
  };
  
}
