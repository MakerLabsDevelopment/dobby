import React from 'react'
import { useRecoilValue } from 'recoil'
import { threadActiveIdState } from '../state'
import styles from './Collection.module.css'

const Collection = ({ collection: { name } }: any) => {
  const threadId = useRecoilValue(threadActiveIdState)
  return (
    <a className={styles.collection} href={`/threads/${threadId}/${name}`}>
      {name}
    </a>
  )
}

export { Collection }
