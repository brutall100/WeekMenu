import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStories } from "../../context/StoriesContext";
import { API_URL } from "../../utils/api";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import StoryForm from "../../forms/StoryForm/StoryForm";
import StoryList from "../../components/StoryList/StoryList";
import styles from "./StoriesPage.module.scss";

const StoriesPage = () => {
  const { state, dispatch } = useStories();
  const [editingStory, setEditingStory] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch(`${API_URL}/stories`);
        if (!response.ok) {
          throw new Error("Failed to fetch stories");
        }
        const data = await response.json();
        const sortedStories = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        dispatch({ type: "SET_STORIES", payload: sortedStories });
      } catch (error) {
        console.error("Error fetching stories:", error);
        toast.error("Nepavyko įkelti istorijų.");
      } finally {
        setPageLoading(false); 
      }
    };

    fetchStories();
  }, [dispatch]);

  const handleAddStory = async (newStory) => {
    try {
      const response = await fetch(`${API_URL}/stories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStory),
      });

      if (!response.ok) {
        throw new Error("Failed to add story");
      }

      const savedStory = await response.json();
      dispatch({ type: "ADD_STORY", payload: savedStory });
      toast.success("Istorija sėkmingai pridėta!");
    } catch (error) {
      console.error("Error adding story:", error);
      toast.error("Nepavyko pridėti istorijos.");
    }
  };

  const handleDeleteStory = async (id) => {
    try {
      const response = await fetch(`${API_URL}/stories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete story");
      }

      dispatch({ type: "DELETE_STORY", payload: id });
      toast.success("Istorija sėkmingai ištrinta!");
    } catch (error) {
      console.error("Error deleting story:", error);
      toast.error("Nepavyko ištrinti istorijos.");
    }
  };

  const handleEditStory = async (updatedStory) => {
    try {
      const response = await fetch(
        `${API_URL}/stories/${updatedStory._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedStory),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update story");
      }

      const savedStory = await response.json();
      dispatch({ type: "EDIT_STORY", payload: savedStory });
      setEditingStory(null);
      toast.success("Istorija sėkmingai atnaujinta!");
    } catch (error) {
      console.error("Error editing story:", error);
      toast.error("Nepavyko atnaujinti istorijos.");
    }
  };

  if (pageLoading) {
    return (
      <div className={styles.spinnerContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={styles.storiesPage}>
      <h1>Vartotojų sėkmės istorijos</h1>
      <ToastContainer position="top-right" autoClose={3000} />
      <StoryForm onSubmit={handleAddStory} />
      <StoryList
        stories={state.stories}
        onEdit={handleEditStory}
        onDelete={handleDeleteStory}
        editingStory={editingStory}
        setEditingStory={setEditingStory}
      />
    </div>
  );
};

export default StoriesPage;



