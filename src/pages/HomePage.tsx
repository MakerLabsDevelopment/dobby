import React, { Suspense } from 'react'
import { RootPage } from '../components/RootPage'
import { Loading } from '../components/Loading'
import { Bases } from '../components/Bases'
import 'semantic-ui-css/semantic.min.css'

const HomePage = (): React.ReactElement => (
  <RootPage>
    <h1>Databases</h1>
    <Suspense fallback={<Loading />}>
      <Bases />
    </Suspense>
  </RootPage>
)

export { HomePage }
