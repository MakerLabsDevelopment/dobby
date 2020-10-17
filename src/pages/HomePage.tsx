import React, { Suspense } from 'react'
import { BasePage } from '../components/BasePage'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { Loading } from '../components/Loading'
import { Threads } from '../components/Threads'
import 'semantic-ui-css/semantic.min.css'

const HomePage = (): React.ReactElement => (
  <BasePage>
    <h1>Databases</h1>
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <Threads />
      </Suspense>
    </ErrorBoundary>
  </BasePage>
)

export { HomePage }
