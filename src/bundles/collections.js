import { set, updateAll } from 'shades'

const schema = {
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

export default {
  name: 'collections',
  getReducer: () => {
    const initialData = {
      active: null,
      list: null,
      loading: false,
      data: null,
    }
    return (state = initialData, { type, payload, _err} ) => {
      if (type.startsWith('COLLECTIONS') && type.endsWith('_START')) {
        return set('loading')(true)(state)
      }

      if (type === 'COLLECTIONS_RESET') {
        return initialData
      }

      if (type === 'COLLECTIONS_FETCH_SUCCESS') {
        return updateAll(set('list')(payload), set('loading')(false))(state)
      }

      if (type === 'COLLECTIONS_FETCH_FAILED') {
        return updateAll(set('list')(null), set('loading')(false))(state)
      }

      if (type === 'COLLECTIONS_FETCH_DATA_SUCCESS') {
        return updateAll(
          set('data')(payload.instancesList),
          set('loading')(false),
        )(state)
      }

      if (type === 'COLLECTIONS_FETCH_DATA_FAILED') {
        return updateAll(set('data')(null), set('loading')(false))(state)
      }

      if (type === 'COLLECTIONS_ADD_ROW_SUCCESS') {
        return updateAll(
          set('data')(payload.instancesList),
          set('loading')(false),
        )(state)
      }

      if (type === 'COLLECTIONS_ADD_ROW_FAILED') {
        return updateAll(set('data')(null), set('loading')(false))(state)
      }

      if (type === 'COLLECTIONS_DELETE_ROW_SUCCESS') {
        return updateAll(
          set('data')(payload.instancesList),
          set('loading')(false),
        )(state)
      }

      if (type === 'COLLECTIONS_DELETE_ROW_FAILED') {
        return updateAll(set('data')(null), set('loading')(false))(state)
      }

      if (type === 'COLLECTIONS_FETCH_ACTIVE_SUCCESS') {
        return updateAll(set('active')(payload), set('loading')(false))(state)
      }

      if (type === 'COLLECTIONS_FETCH_ACTIVE_FAILED') {
        return updateAll(set('active')(null), set('loading')(false))(state)
      }

      return state
    }
  },
  doCollectionsFetch: () => {
    return async ({ apiGet, dispatch, store }) => {
      dispatch({ type: 'COLLECTIONS_FETCH_START' })
      const { authClient: client } = store.select(['selectAuthClient'])
      const { threadsActive } = store.select(['selectThreadsActive'])
      return await client
        .listCollections(threadsActive)
        .then((payload) => {
          return dispatch({ type: 'COLLECTIONS_FETCH_SUCCESS', payload })
        })
        .catch((err) => {
          return dispatch({ type: 'COLLECTIONS_FETCH_FAILED', err })
        })
    }
  },
  doCollectionsFetchActive: (name) => {
    return async ({ apiGet, dispatch, store }) => {
      dispatch({ type: 'COLLECTIONS_FETCH_ACTIVE_START' })
      const { authClient: client } = store.select(['selectAuthClient'])
      const { threadsActive } = store.select(['selectThreadsActive'])
      return await client
        .getCollectionInfo(threadsActive, name)
        .then((payload) => {
          return dispatch({ type: 'COLLECTIONS_FETCH_ACTIVE_SUCCESS', payload })
        })
        .catch((err) => {
          return dispatch({ type: 'COLLECTIONS_FETCH_ACTIVE_FAILED', err })
        })
    }
  },
  doCollectionsFetchData: (name) => {
    return async ({ apiGet, dispatch, store }) => {
      dispatch({ type: 'COLLECTIONS_FETCH_DATA_START' })
      const { authClient: client } = store.select(['selectAuthClient'])
      const { threadsActive } = store.select(['selectThreadsActive'])
      return await client
        .find(threadsActive, name, {})
        .then((payload) => {
          return dispatch({ type: 'COLLECTIONS_FETCH_DATA_SUCCESS', payload })
        })
        .catch((err) => {
          return dispatch({ type: 'COLLECTIONS_FETCH_DATA_FAILED', err })
        })
    }
  },
  doCollectionsCreate: (name) => {
    return async ({ dispatch, apiPost, store }) => {
      dispatch({ type: 'COLLECTIONS_ADD_START' })
      const { authClient: client } = store.select(['selectAuthClient'])
      const { threadsActive } = store.select(['selectThreadsActive'])
      const namedSchema = (schema.title = name)
      await client.newCollection(threadsActive, name, namedSchema)
      const data = { _id: Math.random().toString(36), name: '', count: 0 }
      return await client
        .create(threadsActive, name, data)
        .then((payload) => {
          return dispatch({ type: 'COLLECTIONS_ADD_SUCCESS', payload })
        })
        .catch((err) => {
          return dispatch({ type: 'COLLECTIONS_ADD_FAILED', err })
        })
    }
  },
  doCollectionsUpdateSave: (name, data) => {
    return ({ dispatch, store }) => {
      dispatch({ type: 'COLLECTIONS_UPDATE_START' })
      const { authClient: client } = store.select(['selectAuthClient'])
      const { threadsActive } = store.select(['selectThreadsActive'])
      return client
        .save(threadsActive, name, data)
        .then((payload) => {
          return dispatch({ type: 'COLLECTIONS_UPDATE_SUCCESS', payload })
        })
        .catch((err) => {
          return dispatch({ type: 'COLLECTIONS_UPDATE_FAILED', err })
        })
    }
  },
  doCollectionsAddRow: (name, emptyRowObject) => {
    return ({ dispatch, store }) => {
      dispatch({ type: 'COLLECTIONS_ADD_ROW_START' })
      const { authClient: client } = store.select(['selectAuthClient'])
      const { threadsActive } = store.select(['selectThreadsActive'])
      return client
        .create(threadsActive, name, [emptyRowObject])
        .then((payload) => {
          return dispatch({ type: 'COLLECTIONS_ADD_ROW_SUCCESS', payload })
        })
        .catch((err) => {
          return dispatch({ type: 'COLLECTIONS_ADD_ROW_FAILED', err })
        })
    }
  },
  doCollectionsDeleteRow: (name, instanceId) => {
    return ({ dispatch, store }) => {
      dispatch({ type: 'COLLECTIONS_DELETE_ROW_START' })
      const { authClient: client } = store.select(['selectAuthClient'])
      const { threadsActive } = store.select(['selectThreadsActive'])
      return client
        .delete(threadsActive, name, [instanceId])
        .then((payload) => {
          return dispatch({ type: 'COLLECTIONS_DELETE_ROW_SUCCESS', payload })
        })
        .catch((err) => {
          return dispatch({ type: 'COLLECTIONS_DELETE_ROW_FAILED', err })
        })
    }
  },
  doCollectionsAddColumn: (name, schema_type) => {
    return ({ dispatch, store }) => {
      dispatch({ type: 'COLLECTIONS_ADD_COLUMN_START' })
      const { authClient: client } = store.select(['selectAuthClient'])
      const { threadId } = store.select(['selectThreadsActive'])
      schema.properties.field = { type: schema_type }
      return client
        .updateCollection(threadId, name, schema)
        .then((payload) => {
          return dispatch({ type: 'COLLECTIONS_ADD_COLUMN_SUCCESS', payload })
        })
        .catch((err) => {
          return dispatch({ type: 'COLLECTIONS_ADD_COLUMN_FAILED', err })
        })
    }
  },
  selectCollectionsLoading: (state) => state.collections.loading,
  selectCollectionsList: (state) => state.collections.list,
  selectCollectionsActive: (state) => state.collections.active,
  selectCollectionsData: (state) => state.collections.data,
}
