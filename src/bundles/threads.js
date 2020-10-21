import { set, updateAll } from 'shades'
import { createSelector } from 'redux-bundler'
import { ThreadID } from '@textile/hub'

export default {
  name: 'threads',
  getReducer: () => {
    const initialData = {
      active: null,
      loading: false,
      data: null,
    }
    return (state = initialData, { type, payload, err }) => {
      if (type.startsWith('THREADS') && type.endsWith('_START')) {
        return set('loading')(true)(state)
      }

      if (type === 'THREADS_RESET') {
        return initialData
      }

      if (type === 'THREADS_FETCH_SUCCESS') {
        return updateAll(
          set('data')(payload.listList),
          set('loading')(false),
        )(state)
      }

      if (type === 'THREADS_FETCH_FAILED') {
        return updateAll(set('data')(null), set('loading')(false))(state)
      }

      if (type === 'THREADS_SET_ACTIVE') {
        return updateAll(set('active')(payload))(state)
      }

      return state
    }
  },
  doThreadsFetch: (client) => {
    return ({ dispatch }) => {
      dispatch({ type: 'THREADS_FETCH_START' })
      return client
        .listThreads()
        .then((payload) => {
          return dispatch({ type: 'THREADS_FETCH_SUCCESS', payload })
        })
        .catch((err) => {
          return dispatch({ type: 'THREADS_FETCH_FAILED', err })
        })
    }
  },
  doThreadsCreate: () => {
    return async ({ dispatch, store }) => {
      dispatch({ type: 'THREADS_ADD_START' })
      const client = await store.selectAuthClient()
      const threadId = client.newDB()
      return threadId
        .then((payload) => {
          return dispatch({ type: 'THREADS_ADD_SUCCESS', payload })
        })
        .catch((err) => {
          return dispatch({ type: 'THREADS_ADD_FAILED', err })
        })
    }
  },
  doThreadsSetActive: (threadId) => {
    return async ({ dispatch, store }) => {
      const id = ThreadID.fromString(threadId)
      const result = await dispatch({
        type: 'THREADS_SET_ACTIVE',
        payload: id,
      })
      return result
    }
  },
  reactThreadsPath: createSelector(
    'selectThreadsActive',
    'selectAuthClient',
    'selectThreadsData',
    'selectThreadsLoading',
    'selectPathname',
    'selectRouteParams',
    (active, client, data, loading, pathname, { threadId }) => {
      // console.log("aa", active, data);
      // console.log("ab", client, loading);
      // console.log("ac", threadId, pathname);
      if (
        client &&
        active &&
        pathname.match(/\/threads/) &&
        !loading &&
        !threadId
      ) {
        return { actionCreator: 'doThreadsSetActive', args: [null] }
      }
      if (client && data && !loading && threadId && !active) {
        return { actionCreator: 'doThreadsSetActive', args: [threadId] }
      }
    },
  ),
  reactThreadsShouldFetch: createSelector(
    'selectAuthClient',
    'selectThreadsData',
    'selectThreadsLoading',
    'selectRouteParams',
    (authClient, threadsData, loading, { threadId }) => {
      if (authClient && !threadsData && !loading) {
        return { actionCreator: 'doThreadsFetch', args: [authClient] }
      }
    },
  ),
  selectThreadsLoading: (state) => state.threads.loading,
  selectThreadsData: (state) => state.threads.data,
  selectThreadsActive: (state) => state.threads.active,
}
