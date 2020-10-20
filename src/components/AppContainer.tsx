import React from 'react'
import { connect } from 'redux-bundler-react'

interface AppContainerProps {
  route: any
}

const AppContainer = ({ route }: AppContainerProps) => {
  const Screen = route
  return (
    <div>
      <Screen />
    </div>
  )
}

export default connect(
  'selectRoute',
  AppContainer
)
