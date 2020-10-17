import { atom, selector } from 'recoil'
import { PrivateKey, Client } from '@textile/hub'

const keyInfo = { key: 'bs3g66aciasarrm46kosxap74te' }

const clientQuerySelector = selector({
  key: 'client',
  get: async () => {
    let storedIdent = localStorage.getItem('identity') || ''
    if (!storedIdent) {
      try {
        const identity = PrivateKey.fromRandom()
        const identityString = identity.toString()
        localStorage.setItem('identity', identityString)

        const client = await Client.withKeyInfo(keyInfo)
        await client.getToken(identity)
      } catch (err) {
        throw err
      }
    }
    const identity = PrivateKey.fromString(storedIdent)
    const client = await Client.withKeyInfo(keyInfo, undefined, true)
    await client.getToken(identity)
    return client
  },
})

const threadsQuerySelector = selector({
  key: 'threads',
  get: async ({ get }) => {
    const client = get(clientQuerySelector)
    try {
      const threads = await client.listThreads()
      return [...threads.listList]
    } catch (err) {
      throw err
    }
  },
})

const threadActiveIdState = atom({
  key: 'threadActiveId',
  default: null,
})

// const threadCreateSelector = selector({

//     return async ({ dispatch, store }) => {
//       dispatch({ type: "THREADS_ADD_START" });
//       const client = await store.selectAuthClient();
//       const threadId = client.newDB();
//       return threadId
//         .then((payload) => {
//           return dispatch({ type: "THREADS_ADD_SUCCESS", payload });
//         })
//         .catch((err) => {
//           return dispatch({ type: "THREADS_ADD_FAILED", err });
//         });
//     };

export { clientQuerySelector, threadActiveIdState, threadsQuerySelector }
