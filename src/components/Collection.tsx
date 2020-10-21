import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'redux-bundler-react'
import clsx from 'clsx'
import { useRecoilValue } from 'recoil'
import { threadActiveIdState } from '../state'
import styles from './Collection.module.css'

const CollectionComponent = ({ collection: { name } }: any) => {
  const threadId = useRecoilValue(threadActiveIdState)
  const [newCollectionName, setNewCollectionName] = useState('')
  const [editActiveCollectionName, setEditActiveCollectionName] = useState(false)

  const useOutsideAlerter = (ref: any) => {
    useEffect(() => {
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          setEditActiveCollectionName(false)
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref])
  }
  const wrapperRef = useRef(null)
  useOutsideAlerter(wrapperRef)

  // placeholder. need to workout how to check route with recoil
  const activeCollection = false

  return (
    <>
      {activeCollection && (
        <div
          className={clsx(styles.collection, styles.active)}
          onDoubleClick={() => setEditActiveCollectionName(true)}
        >
          {!editActiveCollectionName && (<span>{name}</span>)}
          {editActiveCollectionName && (
            <input
              ref={wrapperRef}
              value={newCollectionName}
              className={styles.nameInput}
              onChange={(e) => setNewCollectionName(e.target.value)}
            />
          )}
        </div>
      )}
      {!activeCollection && (
        <a
          className={styles.collection}
          href={`/threads/${threadId}/${name}`}
        >
          {name}
        </a>
      )}
    </>
  )
}

const Collection  = connect(
  'selectRouteParams',
  CollectionComponent,
)

export { Collection }
