import React, { Suspense, ReactElement } from 'react'
import { RootPage } from '../components/RootPage'
import { Loading } from '../components/Loading'
import { Bases } from '../components/Bases'
import { MetaMaskConnection } from '../components/MetaMaskConnection'
import 'semantic-ui-css/semantic.min.css'

const HomePage = (): ReactElement => {
  return (
    <RootPage>
      <h1>Databases</h1>
      <MetaMaskConnection />
      <Suspense fallback={<Loading />}>
        <Bases />
      </Suspense>
    </RootPage>
  )
}
export { HomePage }
