import React, { useEffect, Suspense } from 'react'
import { connect } from 'redux-bundler-react'
import { useSetRecoilState, useRecoilCallback } from 'recoil'
import { Loading } from '../components/Loading'
import { Collections } from '../components/Collections'
import { BasePage } from '../components/BasePage'
import Table from '../components/table/Table'
import {
  collectionSchema,
  clientQuerySelector,
  threadActiveIdState,
} from '../state'
import { ThreadID } from '@textile/hub'
import { v4 as uuidv4 } from 'uuid'

import styles from './ThreadPage.module.css'

interface IThreadPage {
  routeParams: any
}

const ThreadPageComponent = ({
  routeParams: { threadId },
}: IThreadPage) => {
  const setThreadActiveId = useSetRecoilState(threadActiveIdState)
  useEffect(() => {
    setThreadActiveId(threadId)
  }, [threadId, setThreadActiveId])

  const collectionCreate = useRecoilCallback(({ snapshot }) => async () => {
    const client = await snapshot.getPromise(clientQuerySelector)
    const threadActiveId =
      (await snapshot.getPromise(threadActiveIdState)) || ''
    const threadId = ThreadID.fromString(threadActiveId)
    try {
      await client.newCollection(threadId, 'table', {
        schema: collectionSchema,
      })
      const data = { _id: uuidv4(), name: '', count: 0 }
      const collection = await client.create(threadId, '', [data])
      console.log(collection)
    } catch (err) {
      console.log(err)
    }
  })

  return (
    <BasePage>
      <div className={styles.optionsRow}>
        <Suspense fallback={<Loading />}>
          <Collections />
        </Suspense>
        <div className={styles.plusButton} onClick={collectionCreate}>
          +
        </div>
      </div>
      <Table />
    </BasePage>
  )
}

const ThreadPage = connect(
  'selectRouteParams',
  ThreadPageComponent,
)

export { ThreadPage }
