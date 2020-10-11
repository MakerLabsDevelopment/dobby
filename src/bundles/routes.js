import { createRouteBundle } from 'redux-bundler'
import HomePage from '../components/Home'
import ThreadScreen from '../components/ThreadScreen'

export default createRouteBundle({
  '/': HomePage,
  '/threads/:threadId': ThreadScreen,
  '/threads/:threadId/:collectionName': ThreadScreen
})
