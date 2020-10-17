import React from "react";
import { useRecoilValue } from "recoil";
import { Thread } from "./Thread";
import { threadsQuerySelector } from "../state";
import styles from "./Threads.module.css";

const Threads = () => {
  const threads = useRecoilValue(threadsQuerySelector);
  return (
    <div className={styles.threads}>
      {threads?.map((thread: any) => (
        <Thread key={thread.id} thread={thread} />
      ))}
    </div>
  );
};

export { Threads };
