import useSWR from "swr";
import { get_action } from "../pages/api/actions";
import { useEffect, useState } from "react";

export function useActiveNotebook(userId: any, email: any) {
  
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error, mutate } = useSWR(
    `/api/getData?action=${get_action.get_active_notebook}&userId=${userId}&email=${email}`,
     fetcher
   );
  
  const [idPage, setIdPage] = useState<string>("");
 
  useEffect(() => {
    if (data && Array.isArray(data)) {
      setIdPage(data[0]);
    }
  }, [data]);




  return {
    idPage,
    setIdPage,
    mutateId:mutate
};
  



  
}
