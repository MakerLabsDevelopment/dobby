import React from 'react'
import ReactDOM from 'react-dom'
import { RecoilRoot } from 'recoil'
import { Provider } from 'redux-bundler-react'
import getStore from './bundles'
import './assets/css/index.css'
import AppContainer from './components/AppContainer'
import * as serviceWorker from './serviceWorker'
import './assets/css/index.css'
import * as dummy from "./model/dummy"
import {newColumnId} from './model/model'

const dummyRepo = dummy.newDummyRepo([
    {
        name: "Base 1",
        tables: {
            "table1": {
                columns: [
                    {
                        id: newColumnId("col1"),
                        description: "ID",
                    },
                    {
                        id: newColumnId("col2"),
                        description: "Number of dogs",
                    }
                ],
                name: "table1",
                rows: [],
            }
        }
    },
    {
        name: "Base 2",
        tables: {
            "table1": {
                columns: [
                    {
                        id: newColumnId("col1"),
                        description: "ID",
                    },
                    {
                        id: newColumnId("col2"),
                        description: "Number of dogs",
                    }
                ],
                name: "table1",
                rows: [],
            }
        }
    }
])

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
