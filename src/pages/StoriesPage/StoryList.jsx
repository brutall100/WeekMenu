import React from "react";
import StoryCard from "../../components/StoryCard/StoryCard";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import styles from "./StoryList.module.scss";

const StoryList = ({ stories, onEdit, onDelete, editingStory, setEditingStory, loading }) => {
  if (loading) {
    return (
      <div className={styles.spinnerContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  if (!stories.length) {
    return <p className={styles.noStories}>Nėra istorijų.</p>;
  }

  return (
    <div className={styles.storyList}>
      {stories.map((story) => (
        <StoryCard
          key={story._id}
          story={story}
          onEdit={onEdit}
          onDelete={onDelete}
          editingStory={editingStory}
          setEditingStory={setEditingStory}
        />
      ))}
    </div>
  );
};

export default StoryList;


