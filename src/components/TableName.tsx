import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'redux-bundler-react'
import clsx from 'clsx'
import { useRecoilValue } from 'recoil'
import { activeBaseId } from '../state'
import styles from './TableName.module.css'
import {Table} from '../model'

const TableName = ({ table } : {table: Table}) => {
  const baseId = useRecoilValue(activeBaseId)
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
          {!editActiveCollectionName && (<span>{table.name}</span>)}
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
          className={styles.tableName}
          href={`/bases/${baseId?.value}/${table.name}`}
        >
          {table.name}
        </a>
      )}
    </>
  )
}

const ConnectedTableName  = connect(
  'selectRouteParams',
  TableName,
)

export { ConnectedTableName as TableName }
