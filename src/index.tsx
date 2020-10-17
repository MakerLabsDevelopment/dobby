import React from 'react'
import ReactDOM from 'react-dom'
import { RecoilRoot } from 'recoil'
import { Provider } from 'redux-bundler-react'
import getStore from './bundles'
import AppContainer from './components/AppContainer'
import * as serviceWorker from './serviceWorker'
import './assets/css/index.css'

const appContainer = document.getElementById('root')
if (appContainer == null) {
  throw new Error('Unable to find DOM element to render app')
}

ReactDOM.render(
  <Provider store={getStore()}>
    <RecoilRoot>
      <AppContainer />
    </RecoilRoot>
  </Provider>,
  appContainer,
)

serviceWorker.unregister()
