import React, { Suspense } from 'react'
import { BasePage } from '../components/BasePage'
import { Loading } from '../components/Loading'
import { Threads } from '../components/Threads'
import 'semantic-ui-css/semantic.min.css'

const HomePage = (): React.ReactElement => (
  <BasePage>
    <h1>Databases</h1>
    <Suspense fallback={<Loading />}>
      <Threads />
    </Suspense>
  </BasePage>
)

export { HomePage }
