import { createContext } from "react";
import { useProvideAuth } from "../hooks";

// global auth state => contains info of the authenticated user
// default value of the global auth state
const initialState = {
  user: null,
  loading: true,
};

export const AuthContext = createContext(initialState);

export const AuthProvider = ({ children }) => {
  const auth = useProvideAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
