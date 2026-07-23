import {
  createContext,
  useContext,
} from "react";

const ApiContext = createContext(null);

export const ApiProvider = ({ children }) => {
  const apiurl = 'https://areya-bazaar-backend.onrender.com';

  return (
    <ApiContext.Provider value={{apiurl}}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);

  if (!context) {
    throw new Error(
      "useApi must be used inside ApiProvider"
    );
  }

  return context;
};