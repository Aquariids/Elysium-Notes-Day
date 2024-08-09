import useSWR from "swr";
import { get_action } from "../pages/api/actions";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useCurrentIdPage(userId: string, email: string,) {


    const { data, error } = useSWR(
      `/api/getData?action=${get_action.get_active_notebook}&userId=${userId}&email=${email}`,
       fetcher
     );

     
   
     return {
       idPage: data && data[0],
       isLoading: !error && !data,
       isError: error,
     };
  


  
}
