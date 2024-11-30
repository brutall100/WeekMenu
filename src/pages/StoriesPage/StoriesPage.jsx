import React, { useState, useEffect } from "react";
import { API_URL } from "../../utils/api";
import styles from "./StoriesPage.module.scss";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const StoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newStory, setNewStory] = useState({ title: "", content: "" });
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
        const sortedStories = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
    if (!newStory.title || !newStory.content) {
      alert("Pavadinimas ir turinys yra būtini!");
      return;
    }

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
      setStories((prevStories) => [savedStory, ...prevStories]);
      setNewStory({ title: "", content: "" });
    } catch (error) {
      console.error("Error adding story:", error);
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

      setStories((prevStories) => prevStories.filter((story) => story._id !== id));
    } catch (error) {
      console.error("Error deleting story:", error);
    }
  };

  // Edit a story
  const handleEditStory = async () => {
    if (!editingStory.title || !editingStory.content) {
      alert("Pavadinimas ir turinys yra būtini!");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/stories/${editingStory._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingStory.title,
          content: editingStory.content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update story");
      }

      const updatedStory = await response.json();
      setStories((prevStories) =>
        prevStories.map((story) =>
          story._id === updatedStory._id ? updatedStory : story
        )
      );
      setEditingStory(null);
    } catch (error) {
      console.error("Error editing story:", error);
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

      {/* Form to add a new story */}
      <div className={styles.newStoryForm}>
        <h2>Pridėti naują istoriją</h2>
        <input
          type="text"
          placeholder="Pavadinimas"
          value={newStory.title}
          onChange={(e) =>
            setNewStory((prev) => ({ ...prev, title: e.target.value }))
          }
        />
        <textarea
          placeholder="Turinys"
          value={newStory.content}
          onChange={(e) =>
            setNewStory((prev) => ({ ...prev, content: e.target.value }))
          }
        />
        <button onClick={handleAddStory}>Pridėti</button>
      </div>

      {/* Stories List */}
      <div className={styles.storiesList}>
        {stories.map((story) => (
          <div key={story._id} className={styles.storyCard}>
            {editingStory && editingStory._id === story._id ? (
              <>
                <input
                  type="text"
                  value={editingStory.title}
                  onChange={(e) =>
                    setEditingStory((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
                <textarea
                  value={editingStory.content}
                  onChange={(e) =>
                    setEditingStory((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                />
                <button onClick={handleEditStory}>Išsaugoti</button>
                <button onClick={() => setEditingStory(null)}>Atšaukti</button>
              </>
            ) : (
              <>
                <h3>{story.title}</h3>
                <p>{story.content}</p>
                <button onClick={() => setEditingStory(story)}>Redaguoti</button>
                <button onClick={() => handleDeleteStory(story._id)}>Ištrinti</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoriesPage;






