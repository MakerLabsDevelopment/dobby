import React from 'react'
import { connect } from 'redux-bundler-react'
import { ErrorBoundary } from '../components/ErrorBoundary'

interface AppContainerProps {
  route: any
}

const AppContainer = ({ route }: AppContainerProps) => {
  const Page = route
  return (
    <ErrorBoundary>
      <Page />
    </ErrorBoundary>
  )
}

export default connect('selectRoute', AppContainer)
