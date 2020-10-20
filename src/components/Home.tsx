import React, { useEffect, ReactElement } from 'react'
import { connect } from 'redux-bundler-react'
import ColourHash from 'color-hash'
import BaseScreen from './BaseScreen'
import 'semantic-ui-css/semantic.min.css'
import styles from './Home.module.css'

interface HomeProps {
  authSignedIn: boolean
  doAuthSignIn: () => any
  threadsData: any
}

const Home = ({
  authSignedIn,
  doAuthSignIn,
  threadsData
}: HomeProps): ReactElement<HomeProps> => {
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
      <h1>Databases</h1>
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
  'selectAuthSignedIn',
  'selectThreadsData',
  Home
)
