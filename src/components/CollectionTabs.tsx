import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'redux-bundler-react'
import clsx from 'clsx'
import styles from './CollectionTabs.module.css'

interface CollectionTabsProps {
  collectionsList: any
  doCollectionsCreate: () => any
  doUpdateUrl: (url: string) => any
  routeParams: any
}

const CollectionTabs = ({
  collectionsList,
  doCollectionsCreate,
  doUpdateUrl,
  routeParams
}: CollectionTabsProps) => {
  const threadId = routeParams.threadId
  const collectionName = routeParams.collectionName
  const [editActiveCollectionName, setEditActiveCollectionName] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState('')
  const sortedCollections = collectionsList && collectionsList.sort((a: any, b: any) => {
    let textA = a.name.toUpperCase()
    let textB = b.name.toUpperCase()
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
  })

  useEffect(() => {
    const setup = async () => {
      if (sortedCollections && !collectionName) {
        // temp - replace with sort order.
        doUpdateUrl(`/threads/${threadId}/${sortedCollections[0].name}`)
      }
    }
    setup()
  }, [collectionsList])

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

  return (
    <div className={styles.optionsRow}>
      {sortedCollections.map((collection: any, index: number) => {
        if (collection.name === collectionName) {
          return <div
            key={index}
            className={clsx(styles.collectionTab, styles.active)}
            onDoubleClick={() => setEditActiveCollectionName(true)}
          >
            {!editActiveCollectionName && (<span>{collection.name}</span>)}
            {editActiveCollectionName && (
              <input
                ref={wrapperRef}
                value={newCollectionName}
                className={styles.nameInput}
                onChange={(e) => setNewCollectionName(e.target.value)}
              />
            )}
          </div>
        } else {
          return <a
            key={index}
            className={clsx(styles.collectionTab)}
            href={`/threads/${threadId}/${collection.name}`}
          >
            {collection.name}
          </a>
        }
      })}
      <div className={styles.plusButton} onClick={() => doCollectionsCreate()}>+</div>
    </div>
  )
}

export default connect(
  'doUpdateUrl',
  'doCollectionsCreate',
  'selectCollectionsList',
  'selectRouteParams',
  CollectionTabs
)
