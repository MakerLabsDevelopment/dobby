import React from "react";
import styles from "./Thread.module.css";

const Thread = ({ thread: { id, name } }: any) => {
  return (
    <a className={styles.thread} href={`/threads/${id}`}>
      <p>{name || "Untitled"}</p>
    </a>
  );
};

export { Thread };
