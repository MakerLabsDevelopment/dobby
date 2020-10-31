import { atom, selector, RecoilValueReadOnly, AtomOptions, ReadOnlySelectorOptions, DefaultValue } from 'recoil'
import type { RecoilState } from 'recoil'
import { PrivateKey, Client, ThreadID } from '@textile/hub'
import type { DobbyRepo, Base, Row} from '../model'
import { equalIds } from '../model'
import * as dummy from '../model/dummy'
import {newColumnId, BaseID, Table, TableID } from '../model/model'

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

const repo = dummy.newDummyRepo([
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
                        type: 'string',
                    },
                    {
                        id: newColumnId("col2"),
                        description: "Number of dogs",
                        type: 'number',
                    }
                ],
                name: "table1",
                rows: [
                  {
                    "col1": {type: "string", value: "row1id"},
                    "col2": {type: "number", value: 10},
                  },
                  {
                    "col1": {type: "string", value: "row2id"},
                    "col2": {type: "number", value: 20},
                  }
                ],
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
                        type: 'string',
                    },
                    {
                        id: newColumnId("col2"),
                        description: "Number of dogs",
                        type: 'number',
                    }
                ],
                name: "table1",
                rows: [],
            }
        }
    }
])

interface DobbyRepoWrapper {
    repo: DobbyRepo,
    version: number,
}
let wrapper = {
    repo,
    version: 1,
}

const dobbyRepoWrapper: RecoilState<DobbyRepoWrapper> = atom({
    key: "dobbyRepoWrapper",
    default: wrapper,
    effects_UNSTABLE: [
        ({setSelf, trigger}) => {
            repo.addListener(() => {
                wrapper = {
                    version: wrapper.version + 1,
                    repo,
                }
                setSelf(wrapper)
            })
            if (trigger === "get") {
                setSelf(wrapper)
            }
        }
    ]
})

const basesSelector: RecoilValueReadOnly<Base[]> = selector({
    key: 'bases',
    get: async ({ get }) => {
        const repo = get(dobbyRepoWrapper).repo
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
        const repo = get(dobbyRepoWrapper).repo
        const bases = await repo.listBases()
        const base = bases.find(b => equalIds(b.id, baseId))
        if (base != null) {
            return base
        }
        return null
    },
    dangerouslyAllowMutability: true,
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
    dangerouslyAllowMutability: true,
})

const activeTableIdOptions: AtomOptions<TableID | null> = {
    key: 'activeTableId',
    default: null,
}
const activeTableId = atom(activeTableIdOptions)

const activeTableOptions: ReadOnlySelectorOptions<Table | null> = {
    key: "activeTable",
    get: async ({ get }) => {
        const base = get(activeBase)
        if (base == null) {
            return null
        }
        const tableId = get(activeTableId)
        if (tableId == null){
            if (base.tables.length > 0) {
                return base.tables[0]
            } else {
                return null
            }
        }
        const table = base.tables.find(t => equalIds(tableId, t.id))
        if (table == null) {
            return null
        }
        return table
    },
    dangerouslyAllowMutability: true,
}
const activeTable: RecoilValueReadOnly<Table | null> = selector(activeTableOptions)

const activeTableRows: RecoilValueReadOnly<Row[]> = selector({
    key: "activeTableRows",
    get: async ({ get }) => {
        const activeBaseVal = get(activeBase)
        if (activeBaseVal == null) {
            return []
        }
        const activeTableVal = get(activeTable)
        if (activeTableVal == null) {
            return []
        }
        const repo = get(dobbyRepoWrapper).repo
        const rows = await repo.rowsForTable(activeBaseVal.id, activeTableVal.id)
        if (rows == null) {
            return []
        } else {
            return rows
        }
    },
    dangerouslyAllowMutability: true,
})

export {
  clientQuerySelector,
  // collectionCreateSelector,
  collectionsQuerySelector,
  threadActiveIdState,
  threadsQuerySelector,
  collectionSchema,
  activeBase,
  activeBaseId,
  basesSelector,
  tablesSelector,
  activeTableId,
  activeTable,
  activeTableRows,
  dobbyRepoWrapper,
}
