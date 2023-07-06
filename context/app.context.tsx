import { createContext, ReactNode, useState } from "react";

export interface IAppContext {
    idPage: any;
    setIdPage:any
}


export const AppContext = createContext<IAppContext>({
idPage: [],
setIdPage: () => {}

});



export const AppContextProvider = ({
  children,
}: IAppContext & { children: ReactNode }): JSX.Element => {

    const [idPage, setIdPage] = useState();
  return (<AppContext.Provider value={{ idPage, setIdPage }}>{children}</AppContext.Provider>)
};
