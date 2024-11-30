import React from "react";
import styles from "./StoryCard.module.scss";

const StoryCard = ({ story, onEdit, onDelete, editingStory, setEditingStory }) => {
  const isEditing = editingStory && editingStory._id === story._id;

  return (
    <div className={styles.storyCard}>
      {isEditing ? (
        <>
          <input
            type="text"
            value={editingStory.title}
            placeholder="Pavadinimas"
            onChange={(e) =>
              setEditingStory({ ...editingStory, title: e.target.value })
            }
          />
          <textarea
            value={editingStory.content}
            placeholder="Turinys"
            onChange={(e) =>
              setEditingStory({ ...editingStory, content: e.target.value })
            }
          />
          <input
            type="text"
            value={editingStory.author}
            placeholder="Autorius"
            onChange={(e) =>
              setEditingStory({ ...editingStory, author: e.target.value })
            }
          />
          <div className={styles.buttons}>
            <button onClick={() => onEdit(editingStory)}>Išsaugoti</button>
            <button onClick={() => setEditingStory(null)}>Atšaukti</button>
          </div>
        </>
      ) : (
        <>
          <h3>{story.title}</h3>
          <p>{story.content}</p>
          <p>
            <strong>Autorius:</strong> {story.author || "Nežinomas"}
          </p>
          <div className={styles.buttons}>
            <button onClick={() => setEditingStory(story)}>Redaguoti</button>
            <button onClick={() => onDelete(story._id)}>Ištrinti</button>
          </div>
        </>
      )}
    </div>
  );
};

export default StoryCard;
