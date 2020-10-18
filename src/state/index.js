import { atom, selector, selectorFamily, useRecoilCallback } from 'recoil'
import { PrivateKey, Client, ThreadID } from '@textile/hub'

const collectionSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: null,
  type: 'object',
  properties: {
    _id: { type: 'string' },
    name: { type: 'string' },
    missions: {
      type: 'number',
      minimum: 0,
    },
  },
}

const columnsSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: { type: 'string' },
  type: 'object',
  properties: {
    Header: { type: 'string' },
    columns: {
      type: 'array',
      items: {
        Header: { type: 'string' },
        accessor: { type: 'string' },
        width: { type: 'string' },
        aggregate: { type: 'string' },
      },
      minItems: 1,
      uniqueItems: true,
    },
  },
}

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
  key: 'threadActiveIdState',
  default: null,
})

const collectionsQuerySelector = selector({
  key: 'collections',
  get: async ({ get }) => {
    const client = get(clientQuerySelector)
    const threadActiveId = get(threadActiveIdState)
    try {
      const threadId = ThreadID.fromString(threadActiveId)
      const collections = await client.listCollections(threadId)
      return collections
    } catch (err) {
      throw err
    }
  },
})

// const collectionCreateSelector = selectorFamily({
//   key: 'collectionCreate',
//   get: (name) => async ({ get }) => {
//     const client = get(clientQuerySelector)
//     const threadActiveId = get(threadActiveIdState)
//     const namedSchema = (schema.title = name)
//     await client.newCollection(threadActiveId, name, namedSchema)
//     const data = { _id: Math.random().toString(36), name: '', count: 0 }
//     const collection = await client.create(threadActiveId, name, data)
//     console.log(collection)
//     return collection
//   },
// })

export {
  clientQuerySelector,
  // collectionCreateSelector,
  collectionsQuerySelector,
  threadActiveIdState,
  threadsQuerySelector,
  collectionSchema,
}
