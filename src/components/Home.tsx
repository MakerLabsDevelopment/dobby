import React, { Suspense, useEffect } from 'react'
import { connect } from 'redux-bundler-react'
import ColourHash from 'color-hash'
import BaseScreen from './BaseScreen'
import { ErrorBoundary } from './ErrorBoundary'
import { Loading } from './Loading'
import { Threads } from './Threads'
import 'semantic-ui-css/semantic.min.css'
import styles from './Home.module.css'

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

  const colourHash = new ColourHash()
  const bgColour = (formattedInitials: string) => (
    { backgroundColor: colourHash.hex(formattedInitials) }
  )

  return (
    <BaseScreen>
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <Threads />
        </Suspense>
      </ErrorBoundary>
      <button onClick={doThreadsCreate}>New</button>
      <div className={styles.threadsList}>
        {threadsData && threadsData.map((thread: any, index: number) => (
          <a className={styles.thread} key={index} href={`/threads/${thread.id}`}>
            <div
              style={bgColour(thread.name.substring(0, 2))}
              className={styles.threadIcon}
            >
              {thread.name.substring(0, 2)}
            </div>
            <div className={styles.threadName}>{thread.name || 'no name'}</div>
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
