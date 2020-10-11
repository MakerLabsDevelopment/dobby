import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'redux-bundler-react'
import getStore from './bundles'
import './assets/css/index.css'
import AppContainer from './components/AppContainer'
import * as serviceWorker from './serviceWorker'

const appContainer = document.getElementById('root')
if (appContainer == null) {
  throw new Error('Unable to find DOM element to render app')
}

ReactDOM.render(
  <Provider store={getStore()}>
    <AppContainer />
  </Provider>,
  appContainer
)

serviceWorker.unregister()
