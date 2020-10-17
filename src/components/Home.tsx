import React, { Suspense, useEffect } from 'react'
import { connect } from 'redux-bundler-react'
import BaseScreen from './BaseScreen'
import { ErrorBoundary } from './ErrorBoundary'
import { Loading } from './Loading'
import { Threads } from './Threads'
import 'semantic-ui-css/semantic.min.css'
import './Home.css'

interface IHome {
  authSignedIn: boolean
  doAuthSignIn: () => any
  doThreadsCreate: () => any
  threadsData: any
}

const Home = ({
  authSignedIn,
  doAuthSignIn,
  doThreadsCreate,
  threadsData,
}: IHome): React.ReactElement<IHome> => {
  useEffect(() => {
    if (authSignedIn) {
      doAuthSignIn()
    }
  }, [authSignedIn])

  return (
    <BaseScreen>
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <Threads />
        </Suspense>
      </ErrorBoundary>
      <button onClick={doThreadsCreate}>New</button>
      <div className="threadsList">
        {threadsData &&
          threadsData.map((thread: any, index: number) => (
            <a className="thread" key={index} href={`/threads/${thread.id}`}>
              {thread.name || 'no name'}
            </a>
          ))}
      </div>
    </BaseScreen>
  )
}

export default connect(
  'doAuthSignIn',
  'doThreadsCreate',
  'selectAuthSignedIn',
  'selectThreadsData',
  Home,
)
