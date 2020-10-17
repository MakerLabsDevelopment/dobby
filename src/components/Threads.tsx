import React from "react";
import { selector, useRecoilValue } from "recoil";
import { PrivateKey, Client } from "@textile/hub";
import { Thread } from "./Thread";
import styles from "./Threads.module.css";

const keyInfo = { key: "bs3g66aciasarrm46kosxap74te" };

const threadsQuery = selector({
  key: "Threads",
  get: async ({ get }) => {
    const client = get(clientQuery);
    try {
      const threads = await client.listThreads();
      return [...threads.listList];
    } catch (err) {
      throw err;
    }
  },
});

const clientQuery = selector({
  key: "Client",
  get: async () => {
    let storedIdent = localStorage.getItem("identity") || "";
    if (!storedIdent) {
      try {
        const identity = PrivateKey.fromRandom();
        const identityString = identity.toString();
        localStorage.setItem("identity", identityString);

        const client = await Client.withKeyInfo(keyInfo);
        await client.getToken(identity);
      } catch (err) {
        throw err;
      }
    }
    const identity = PrivateKey.fromString(storedIdent);
    const client = await Client.withKeyInfo(keyInfo, undefined, true);
    await client.getToken(identity);
    return client;
  },
});

const Threads = () => {
  const threads = useRecoilValue(threadsQuery);
  return (
    <div className={styles.threads}>
      {threads?.map((thread: any) => (
        <Thread thread={thread} />
      ))}
    </div>
  );
};

export { Threads };
