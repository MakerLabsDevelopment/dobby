import React, { useEffect } from 'react'
import { connect } from 'redux-bundler-react'
import { useRecoilState } from 'recoil'
import { BasePage } from '../components/BasePage'
import Table from '../components/table/Table'
import { threadActiveIdState } from '../state'
import styles from './ThreadPage.module.css'

interface IThreadPage {
  authClient: any
  collectionsList: any
  doCollectionsCreate: () => any
  doUpdateUrl: (url: string) => any
  routeParams: any
}

const ThreadPageComponent = ({
  authClient,
  collectionsList,
  doCollectionsCreate,
  doUpdateUrl,
  routeParams: { threadId },
}: IThreadPage) => {
  const [threadActiveId, setThreadActiveId] = useRecoilState(
    threadActiveIdState,
  )
  useEffect(() => {
    setThreadActiveId(threadId)
  }, [threadId])

  return (
    <>
      {collectionsList && (
        <BasePage>
          <div className={styles.optionsRow}>
            {collectionsList.map((collection: any, index: number) => (
              <a
                key={index}
                className={styles.collectionTab}
                href={`/threads/${threadId}/${collection.name}`}
              >
                {collection.name}
              </a>
            ))}
            <div
              className={styles.plusButton}
              onClick={() => doCollectionsCreate()}
            >
              +
            </div>
          </div>
          <Table />
        </BasePage>
      )}
    </>
  )
}

const ThreadPage = connect(
  'doUpdateUrl',
  'doThreadsCreate',
  'doCollectionsCreate',
  'selectCollectionsList',
  'selectRouteParams',
  ThreadPageComponent,
)

export { ThreadPage }
