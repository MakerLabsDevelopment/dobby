import React, { useEffect } from 'react'
import { connect } from 'redux-bundler-react'
import BaseScreen from './BaseScreen'
import 'semantic-ui-css/semantic.min.css'
import './Home.css'

interface IHome {
  authSignedIn: boolean
  doAuthSignIn: () => any
  threadsData: any
}

const Home = ({
  authSignedIn,
  doAuthSignIn,
  threadsData
}: IHome): React.ReactElement<IHome> => {
  useEffect(() => {
    if (authSignedIn) {
      doAuthSignIn()
    }
  }, [authSignedIn])

  return (
    <BaseScreen>
      <div className='threadsList'>
        {threadsData && threadsData.map((thread: any, index: number) => (
          <a className='thread' key={index} href={`/threads/${thread.id}`}>{thread.name || 'no name'}</a>
        ))}
      </div>
    </BaseScreen>
  )
}

export default connect(
  'doAuthSignIn',
  'selectAuthSignedIn',
  'selectThreadsData',
  Home
)
