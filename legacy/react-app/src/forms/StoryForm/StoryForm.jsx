import React, { useState } from "react";
import styles from "./StoryForm.module.scss";

const StoryForm = ({ onSubmit }) => {
  const [story, setStory] = useState({ title: "", content: "", author: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!story.title || !story.content || !story.author) {
      alert("Visi laukai yra būtini!");
      return;
    }
    onSubmit(story);
    setStory({ title: "", content: "", author: "" });
  };

  return (
    <form className={styles.storyForm} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Autorius"
        value={story.author}
        onChange={(e) => setStory({ ...story, author: e.target.value })}
      />
      <input
        type="text"
        placeholder="Pavadinimas"
        value={story.title}
        onChange={(e) => setStory({ ...story, title: e.target.value })}
      />
      <textarea
        placeholder="Turinys"
        value={story.content}
        onChange={(e) => setStory({ ...story, content: e.target.value })}
      />
      <button type="submit">Pridėti</button>
    </form>
  );
};

export default StoryForm;
