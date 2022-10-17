import { useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase";
import { AuthContext } from "../providers/AuthProvider";
import { ChatContext } from "../providers/ChatProvider";

// returns the global auth state
export const useAuth = () => {
  return useContext(AuthContext);
};

// returns the global chat state
export const useChat = () => {
  return useContext(ChatContext);
};

export const useProvideAuth = () => {
  const [authUser, setAuthUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // this listener gets the currently signed-in user
    const unsub = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setLoading(false);
    });

    return () => {
      unsub();
    };
  }, []);

  return {
    user: authUser,
    loading,
  };
};

// customHook created to take and handle form inputs
export const useFormInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return {
    value,
    onChange: handleChange,
  };
};
