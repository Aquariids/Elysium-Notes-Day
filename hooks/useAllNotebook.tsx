import useSWR from "swr";
import { get_action } from "../pages/api/actions";

export function useAllNotebook(userId: string, email: string) {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data, error, mutate } = useSWR(
    `/api/getData?action=${get_action.get_all_user_notebook}&userId=${userId}&email=${email}`,
    fetcher
  );

  return {
    dataBooks: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  };
}
