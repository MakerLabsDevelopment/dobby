import { composeBundles, createCacheBundle } from 'redux-bundler'
import auth from './auth'
import collections from './collections'
import threads from './threads'
import routes from './routes'
import { cache } from '.././utils'

export default composeBundles(
  auth,
  collections,
  threads,
  routes,
  createCacheBundle(cache.set),
)
