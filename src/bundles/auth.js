import { set, updateAll } from 'shades'
import { createSelector } from 'redux-bundler'
import { cache } from '.././utils'
import { PrivateKey, Client } from '@textile/hub'

export default {
  name: 'auth',
  getReducer: () => {
    const keyInfo = { key: 'bs3g66aciasarrm46kosxap74te' }
    const initialData = {
      client: null,
      error: null,
      loading: false,
      keyInfo,
    }
    return (state = initialData, { type, payload, err }) => {
      if (type.startsWith('AUTH_') && type.endsWith('_START')) {
        return set('loading')(true)(state)
      }

      if (type === 'AUTH_SIGN_OUT') {
        localStorage.removeItem('identity')
        return set('token')(null)(state)
      }

      if (type === 'AUTH_SIGN_IN_SUCCESS') {
        return updateAll(
          set('error')(null),
          set('loading')(false),
          set('identity')(payload.identity),
          set('client')(payload.client)
        )(state)
      }

      if (type === 'AUTH_SIGN_IN_ERROR') {
        return updateAll(
          set('error')(err.message),
          set('loading')(false)
        )(state)
      }

      return state
    }
  },
  doAuthSignIn: () => {
    return async ({ store, dispatch }) => {
      dispatch({ type: 'AUTH_SIGN_IN_START' })
      let storedIdent = localStorage.getItem('identity')
      const { authKeyInfo: keyInfo } = store.select(['selectAuthKeyInfo'])
      if (storedIdent === null) {
        try {
          const identity = PrivateKey.fromRandom()
          const identityString = identity.toString()
          localStorage.setItem('identity', identityString)

          const client = await Client.withKeyInfo(keyInfo)
          await client.getToken(identity)
          return dispatch({ type: 'AUTH_SIGN_IN_SUCCESS', payload: { identity, client } })
        } catch (err) {
          return dispatch({ type: 'AUTH_SIGN_IN_ERROR', err })
        }
      }
      const identity = PrivateKey.fromString(storedIdent)
      const client = await Client.withKeyInfo(keyInfo)
      await client.getToken(identity)
      return dispatch({ type: 'AUTH_SIGN_IN_SUCCESS', payload: { identity, client } })
    }
  },
  doAuthSignOut: () => {
    return async ({ dispatch, store }) => {
      await cache.clear('dbdb')
      return store.doUpdateUrl('/')
    }
  },
  reactAuthShouldSignIn: createSelector(
    'selectAuthClient',
    'selectAuthLoading',
    (client, loading) => {
      if (!client && !loading) {
        return { actionCreator: 'doAuthSignIn' }
      }
    }
  ),
  selectAuthLoading: (state) => state.auth.loading,
  selectAuthSignedIn: (state) => Boolean(state.auth.token),
  selectAuthToken: (state) => state.auth.token,
  selectAuthClient: (state) => state.auth.client,
  selectAuthKeyInfo: (state) => state.auth.keyInfo,
  persistActions: [
    'AUTH_SIGN_OUT',
  ]
}
