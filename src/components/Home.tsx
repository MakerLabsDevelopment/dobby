import React, { Suspense, useEffect } from 'react'
import { connect } from 'redux-bundler-react'
import ColourHash from 'color-hash'
import BaseScreen from './BaseScreen'
import { ErrorBoundary } from './ErrorBoundary'
import { Loading } from './Loading'
import { Threads } from './Threads'
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
  threadsData,
}: IHome): React.ReactElement<IHome> => {
  useEffect(() => {
    if (authSignedIn) {
      doAuthSignIn()
    }
  }, [authSignedIn])

  const colourHash = new ColourHash()
  const bgColour = (formattedInitials: string) => ({
    backgroundColor: colourHash.hex(formattedInitials),
  })

  return (
    <BaseScreen>
      <h1>Databases</h1>
      <div className="threadsList">
        {threadsData &&
          threadsData.map((thread: any, index: number) => (
            <a className="thread" key={index} href={`/threads/${thread.id}`}>
              <div
                style={bgColour(thread.name.substring(0, 2))}
                className="threadIcon"
              >
                {thread.name.substring(0, 2)}
              </div>
              <div className="threadName">{thread.name || 'no name'}</div>
            </a>
          ))}
      </div>
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <Threads />
        </Suspense>
      </ErrorBoundary>
    </BaseScreen>
  )
}

export default connect(
  'doAuthSignIn',
  'selectAuthSignedIn',
  'selectThreadsData',
  Home,
)
