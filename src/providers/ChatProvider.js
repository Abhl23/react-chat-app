import { createContext, useReducer } from "react";
import { useAuth } from "../hooks";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  
  const INITIAL_STATE = {
    user: null,
    chatId: "",
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatId:
            action.payload.uid > user.uid
              ? action.payload.uid + user.uid
              : user.uid + action.payload.uid,
        };
        case "RESET_USER":
          return INITIAL_STATE;
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
