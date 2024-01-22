import { createContext, useEffect, useReducer } from "react";

const storedUser = localStorage.getItem("user");
let initialUser = null;

try {
  if (storedUser) {
    initialUser = JSON.parse(storedUser);
  }
} catch (error) {
  console.error("Error parsing user from localStorage:", error);
}

const INITIAL_STATE = {
  user: initialUser,
  loading: false,
  error: null,
};

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        loading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        loading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        loading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        user: null,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    try {
      if (state.user !== undefined) {
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    } catch (error) {
      console.error("Error storing user in localStorage:", error);
    }
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};