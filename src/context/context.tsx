import {  createContext,ReactNode,useContext, useState } from "react";
import { ContextType } from "../types/type";
export const IncidentContext = createContext<ContextType | null>(null);

export const IncidentProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setLoading] = useState(false);

  return (
    <IncidentContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </IncidentContext.Provider>
  );
};


export function useLoadingContext(){
  const ctx=useContext(IncidentContext)
  if(!ctx)throw new Error('context not worked')
    return ctx
}