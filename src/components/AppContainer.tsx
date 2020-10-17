import React from 'react'
import { connect } from 'redux-bundler-react'

type AppContainerProps = {
  route: any
}

const AppContainer = ({ route }: AppContainerProps) => {
  const Page = route
  return (
    <div>
      <Page />
    </div>
  )
}

export default connect('selectRoute', AppContainer)
