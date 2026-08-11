import {
  createContext,
  useContext,
} from "react";

const ApiContext = createContext(null);

export const ApiProvider = ({ children }) => {
  const apiurl = 'http://localhost:3000/api';
  const production_api_url = "https://areyabazaarapi.vercel.app/api"

  return (
    <ApiContext.Provider value={{apiurl , production_api_url}}>
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