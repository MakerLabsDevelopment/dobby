import { createRouteBundle } from 'redux-bundler'
import { HomePage } from '../pages/HomePage'
import { ThreadPage } from '../pages/ThreadPage'

export default createRouteBundle({
  '/': HomePage,
  '/threads/:threadId': ThreadPage,
  '/threads/:threadId/:collectionName': ThreadPage,
})
