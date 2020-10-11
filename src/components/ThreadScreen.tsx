import React, { useState, useEffect } from 'react'
import { connect } from 'redux-bundler-react'
import BaseScreen from './BaseScreen'
import { Button } from 'semantic-ui-react'
import Table from './table/Table'
import './ThreadScreen.css'


interface IThreadsScreen {
  authClient: any
  collectionsList: any
  doCollectionsCreate: (name: string) => any
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
  const [name, setName] = useState<string>('')
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
                className='tableButton'
                href={`/threads/${threadId}/${collection.name}`}
              >
                {collection.name}
              </a>
            ))}
            <div className="inputContainer">
              <input className='nameInput' placeholder='table name' type='text' value={name} onChange={e => setName(e.target.value)}/>
              <Button className='ui primary button' onClick={() => doCollectionsCreate(name)}>Create</Button>
            </div>
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
