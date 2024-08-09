import useSWR from "swr";
import { get_action } from "../pages/api/actions";
import { useEffect, useState } from "react";

export function useWithoutId(userId: any, email: any,) {
  
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error, mutate } = useSWR(
    `/api/getData?action=${get_action.get_active_notebook_without_id}&userId=${userId}&email=${email}`,
     fetcher
   );
  
 
 

  return {
    withoutId:data && data[0],
    mutateWithoutId:mutate
};
  



  
}
