import React from 'react'
import { useRecoilValue } from 'recoil'
import { TableName } from './TableName'
import { tablesSelector } from '../state'
import styles from './Tables.module.css'

const Tables = () => {
  const tables = useRecoilValue(tablesSelector)
  return (
    <div className={styles.tables}>
      {tables.map((table) => (
        <TableName key={table.id.value} table={table} />
      ))}
    </div>
  )
}

export { Tables }
