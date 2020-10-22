import { atom, selector, RecoilValueReadOnly, AtomOptions, ReadOnlySelectorOptions } from 'recoil'
import type { RecoilState } from 'recoil'
import { PrivateKey, Client, ThreadID } from '@textile/hub'
import type { DobbyRepo, Base} from '../model'
import { equalIds } from '../model'
import * as dummy from '../model/dummy'
import {newColumnId, BaseID, Table} from '../model/model'

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

const dobbyRepo: RecoilState<DobbyRepo> = atom({
    key: "dobbyRepo",
    default: dummy.newDummyRepo([
        {
            name: "Base 1",
            id: "base1id",
            tables: {
                "table1": {
                    id: "table1base1id",
                    columns: [
                        {
                            id: newColumnId("col1"),
                            description: "ID",
                        },
                        {
                            id: newColumnId("col2"),
                            description: "Number of dogs",
                        }
                    ],
                    name: "table1",
                    rows: [],
                }
            }
        },
        {
            name: "Base 2",
            id: "base2id",
            tables: {
                "table1": {
                    id: "table1base2id",
                    columns: [
                        {
                            id: newColumnId("col1"),
                            description: "ID",
                        },
                        {
                            id: newColumnId("col2"),
                            description: "Number of dogs",
                        }
                    ],
                    name: "table1",
                    rows: [],
                }
            }
        }
    ])
})

const basesSelector: RecoilValueReadOnly<Base[]> = selector({
    key: 'bases',
    get: async ({ get }) => {
        const repo = get(dobbyRepo)
        return repo.listBases()
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
    if (threadActiveId == null) {
      return []
    }
    try {
      const threadId = ThreadID.fromString(threadActiveId)
      const collections = await client.listCollections(threadId)
      const sortedCollections = collections.sort((a, b) => {
        let textA = a.name.toUpperCase()
        let textB = b.name.toUpperCase()
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
      })
      return sortedCollections
    } catch (err) {
      throw err
    }
  },
})

const baseIdOptions: AtomOptions<BaseID | null> = {
    key: "activeBaseId",
    default: null,
}
const activeBaseId: RecoilState<BaseID | null> = atom(baseIdOptions)

const baseOptions: ReadOnlySelectorOptions<Base | null> = {
    key: "activeBase",
    get: async ({ get }) => {
        const baseId = get(activeBaseId)
        if (baseId == null) {
            return null
        }
        const repo = get(dobbyRepo)
        const bases = await repo.listBases()
        const base = bases.find(b => equalIds(b.id, baseId))
        if (base != null) {
            return base
        }
        return null
    },
}
const activeBase: RecoilValueReadOnly<Base | null> = selector(baseOptions)

const tablesSelector: RecoilValueReadOnly<Table[]> = selector({
    key: "tables",
    get: async ({ get }) => {
        const base = get(activeBase)
        if (base == null) {
            return []
        }
        return base.tables
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
  activeBaseId,
  basesSelector,
  tablesSelector,
}
