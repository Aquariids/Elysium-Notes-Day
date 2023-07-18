import { createContext, ReactNode } from "react";
export interface IAppContext {
  title1: any;
}

export const AppContext = createContext<IAppContext>({
  title1: [],
});

export const AppContextProvider = ({
  title1,
  children,
}: IAppContext & { children: ReactNode }): JSX.Element => {
  return (
    <AppContext.Provider value={{ title1 }}>{children}</AppContext.Provider>
  );
};
