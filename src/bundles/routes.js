import { createRouteBundle } from 'redux-bundler'
import { HomePage } from '../pages/HomePage'
import { BasePage } from '../pages/BasePage'

export default createRouteBundle({
  '/': HomePage,
  '/bases/:baseId': BasePage,
  '/bases/:baseId/:tableId': BasePage,
})
