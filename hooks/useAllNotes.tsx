import useSWR from "swr";
import { get_action } from "../pages/api/actions";
import { useWithoutId } from "./useWithoutId";
import { useActiveNotebook } from "./useActiveNotebook";

export function useAllNotes(userId: any, email: any, withoutId:any, idPage:any) {
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
