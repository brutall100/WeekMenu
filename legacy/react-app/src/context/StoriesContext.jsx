import React, { createContext, useReducer, useContext } from "react";

const StoriesContext = createContext();

const storiesReducer = (state, action) => {
  switch (action.type) {
    case "SET_STORIES":
      return { ...state, stories: action.payload };
    case "ADD_STORY":
      return { ...state, stories: [action.payload, ...state.stories] };
    case "DELETE_STORY":
      return {
        ...state,
        stories: state.stories.filter((story) => story._id !== action.payload),
      };
    case "EDIT_STORY":
      return {
        ...state,
        stories: state.stories.map((story) =>
          story._id === action.payload._id ? action.payload : story
        ),
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const StoriesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(storiesReducer, {
    stories: [],
    loading: true,
  });

  return (
    <StoriesContext.Provider value={{ state, dispatch }}>
      {children}
    </StoriesContext.Provider>
  );
};

export const useStories = () => {
  const context = useContext(StoriesContext);
  if (!context) {
    throw new Error("useStories must be used within a StoriesProvider");
  }
  return context;
};

