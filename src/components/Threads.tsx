import React from "react";
import { selector, useRecoilValue } from "recoil";
import { PrivateKey, Client } from "@textile/hub";

const threadsQuery = selector({
  key: "Threads",
  get: async ({ get }) => {
    // const wait = (delay: number) =>
    //   new Promise((resolve) => setTimeout(resolve, delay));
    // await wait(5000);
    try {
      const threads = await client.listThreads();
    } catch (err) {
      throw err;
    }
  },
});

const clientQuery = selector({
  key: "Client",
  get: async ({ get }) => {
    const keyInfo = { key: "bs3g66aciasarrm46kosxap74te" };
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
  const client = useRecoilValue(clientQuery);
  const threads = useRecoilValue(threadsQuery);
  return (
    <>
      {client &&
        threads.map((thread) => <div key={thread.name}>{thread.name}</div>)}
    </>
  );
};

export { Threads };
