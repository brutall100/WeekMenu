import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../../utils/api";
import styles from "./StoriesPage.module.scss";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const StoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newStory, setNewStory] = useState({
    title: "",
    content: "",
    author: "",
  });
  const [editingStory, setEditingStory] = useState(null);

  // Fetch all stories from the database
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
        setStories(sortedStories);
      } catch (error) {
        console.error("Error fetching stories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  // Add a new story
  const handleAddStory = async () => {
    if (!newStory.title || !newStory.content || !newStory.author) {
      toast.error("Visi laukai yra būtini!");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/stories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStory),
      });

      if (!response.ok) {
        throw new Error("Nepavyko pridėti istorijos");
      }

      const savedStory = await response.json();
      setStories((prevStories) => [savedStory, ...prevStories]);
      setNewStory({ title: "", content: "", author: "" });
      toast.success("Istorija sėkmingai pridėta!");
    } catch (error) {
      console.error("Error adding story:", error);
      toast.error("Nepavyko pridėti istorijos.");
    }
  };

  // Delete a story
  const handleDeleteStory = async (id) => {
    try {
      const response = await fetch(`${API_URL}/stories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete story");
      }

      setStories((prevStories) =>
        prevStories.filter((story) => story._id !== id)
      );
      toast.success("Istorija sėkmingai ištrinta!");
    } catch (error) {
      console.error("Error deleting story:", error);
      toast.error("Nepavyko ištrinti istorijos.");
    }
  };

  // Edit a story
  const handleEditStory = async () => {
    if (!editingStory.title || !editingStory.content || !editingStory.author) {
      toast.error("Pavadinimas, turinys ir autorius yra būtini!");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/stories/${editingStory._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingStory.title,
          content: editingStory.content,
          author: editingStory.author,
        }),
      });

      if (!response.ok) {
        throw new Error("Nepavyko atnaujinti istorijos");
      }

      const updatedStory = await response.json();
      setStories((prevStories) =>
        prevStories.map((story) =>
          story._id === updatedStory._id ? updatedStory : story
        )
      );
      setEditingStory(null);
      toast.success("Istorija sėkmingai atnaujinta!");
    } catch (error) {
      console.error("Error editing story:", error);
      toast.error("Nepavyko atnaujinti istorijos.");
    }
  };

  if (loading) {
    return (
      <div className={styles.spinnerContainer}>
        <LoadingSpinner loading={loading} />
      </div>
    );
  }

  return (
    <div className={styles.storiesPage}>
      <h1>Vartotojų sėkmės istorijos</h1>
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Form to add a new story */}
      <div className={styles.newStoryForm}>
        <h2>Pridėti naują istoriją</h2>
        <input
          type="text"
          placeholder="Autorius"
          value={newStory.author}
          onChange={(e) =>
            setNewStory((prev) => ({
              ...prev,
              author: e.target.value,
            }))
          }
        />
        <input
          type="text"
          placeholder="Pavadinimas"
          value={newStory.title}
          onChange={(e) =>
            setNewStory((prev) => ({
              ...prev,
              title: e.target.value,
            }))
          }
        />
        <textarea
          placeholder="Turinys"
          value={newStory.content}
          onChange={(e) =>
            setNewStory((prev) => ({
              ...prev,
              content: e.target.value,
            }))
          }
        />
        <button onClick={handleAddStory}>Pridėti</button>
      </div>

      {/* Stories List */}
      <div className={styles.storiesList}>
        {stories.map((story) => (
          <div key={story._id} className={styles.storyCard}>
            {editingStory && editingStory._id === story._id ? (
              <div className={styles.editForm}>
                <input
                  type="text"
                  value={editingStory.author || ""}
                  placeholder="Autorius"
                  onChange={(e) =>
                    setEditingStory((prev) => ({
                      ...prev,
                      author: e.target.value,
                    }))
                  }
                />
                <input
                  type="text"
                  value={editingStory.title}
                  placeholder="Pavadinimas"
                  onChange={(e) =>
                    setEditingStory((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
                <textarea
                  value={editingStory.content}
                  placeholder="Turinys"
                  onChange={(e) =>
                    setEditingStory((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                />
                <div className={styles.buttons}>
                  <button onClick={handleEditStory}>Išsaugoti</button>
                  <button onClick={() => setEditingStory(null)}>
                    Atšaukti
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3>{story.title}</h3>
                <p>{story.content}</p>
                <p>
                  <strong>Autorius:</strong> {story.author || "Nežinomas"}
                </p>
                <div className={styles.buttons}>
                  <button onClick={() => setEditingStory(story)}>
                    Redaguoti
                  </button>
                  <button onClick={() => handleDeleteStory(story._id)}>
                    Ištrinti
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoriesPage;
