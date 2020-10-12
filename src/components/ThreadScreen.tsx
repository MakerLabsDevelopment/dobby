import React, { useEffect } from 'react'
import { connect } from 'redux-bundler-react'
import BaseScreen from './BaseScreen'
import Table from './table/Table'
import './ThreadScreen.css'


interface IThreadsScreen {
  authClient: any
  collectionsList: any
  doCollectionsCreate: () => any
  doUpdateUrl: (url: string) => any
  routeParams: any
}

const ThreadScreen = ({
  authClient,
  collectionsList,
  doCollectionsCreate,
  doUpdateUrl,
  routeParams
}: IThreadsScreen) => {
  const threadId = routeParams.threadId
  useEffect(() => {
    const setup = async () => {
      if (collectionsList) {
        doUpdateUrl(`/threads/${threadId}/${collectionsList[0].name}`)
      }
    }
    setup()
  }, [collectionsList, authClient])

  return (
    <>
      {collectionsList && (
        <BaseScreen>
          <div className='optionsRow'>
            {collectionsList.map((collection: any, index: number) => (
              <a
                key={index}
                className='collectionTab'
                href={`/threads/${threadId}/${collection.name}`}
              >
                {collection.name}
              </a>
            ))}
            <div className='plusButton' onClick={() => doCollectionsCreate()}>+</div>
          </div>
          <Table />
        </BaseScreen>
      )}
    </>
  )
}

export default connect(
  'doUpdateUrl',
  'doThreadsCreate',
  'doCollectionsCreate',
  'selectCollectionsList',
  'selectRouteParams',
  ThreadScreen
)
