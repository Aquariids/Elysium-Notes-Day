import useSWR from "swr";
import { get_action } from "../pages/api/actions";
import { useCurrentIdPage } from "./useCurrentIdPage";

export function useAllNotes(userId: string, email: string, withoutId: boolean,idPage:string) {


  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const key = (() => {
    if (idPage === "all" && !withoutId) {
      return `/api/getData?action=${get_action.get_all_user_notes}&userId=${userId}&email=${email}`;
    }
    if (idPage === "all" && withoutId) {
      return `/api/getData?action=${get_action.get_all_user_notes_without_id}&userId=${userId}&email=${email}`;
    }
    if (idPage !== "all") {
      return `/api/getData?action=${get_action.get_user_notes_from_notebook}&userId=${userId}&email=${email}&idPage=${idPage}`;
    }
    return null;
  })();

  const { data, error, mutate } = useSWR(key, fetcher);

  return {
    notes: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
