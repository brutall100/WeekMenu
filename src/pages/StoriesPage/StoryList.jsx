import React from "react";
import StoryCard from "../../components/StoryCard/StoryCard";
import styles from "./StoryList.module.scss";

const StoryList = ({ stories, onEdit, onDelete, editingStory, setEditingStory }) => {
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

