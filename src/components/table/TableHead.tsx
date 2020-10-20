import React, { useState } from 'react'
import clsx from 'clsx'
import ColumnOptionsMenu from './ColumnOptionsMenu'
import styles from './TableHead.module.css'

interface TableHeadProps {
  headerGroups: []
  setColumns: (old: any) => any
}

const TableHead = ({ headerGroups, setColumns }: TableHeadProps) => {
  const [xPos, setXPost] = useState('')
  const [yPos, setYPos] = useState('')
  const [columnId, setColumnId] = useState('')
  const [showColumnOptionsMenu, setShowColumnOptionsMenu] = useState(false)

  const onRightClickColumn = (e: any, columnId: string) => {
    e.preventDefault()
    setXPost(e.pageX + "px")
    setYPos(e.pageY + "px")
    setColumnId(columnId)
    setShowColumnOptionsMenu(true)
  }

  const addColumn = async (direction: string, columnId?: string) => {
    const newColData = { Header: 'Field', accessor: 'field' + Math.random(), type: 'single_line_text' }
    setColumns((old: any) =>
      old.map((row: any) => {
        const colIdIndex = columnId ? row.columns.findIndex(
          (col: any) => col.accessor === columnId
        ) : null
        const insertIndex = direction === 'left' ? colIdIndex : colIdIndex + 1
        const index = insertIndex || row.columns.length
        row.columns.splice(index, 0, newColData)
        return row
      })
    )
    // doCollectionsAddColumn(name, 'string')
  }

  return (
    <thead className={styles.tableHeader}>
      {headerGroups.map((headerGroup: any) => (
        <tr {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column: any) => (
            <th
              onContextMenu={(e) => onRightClickColumn(e, column.id)}
              {...column.getHeaderProps()}
            >
              <div>
                {column.canGroupBy ? (
                  <span {...column.getGroupByToggleProps()}>
                    {column.isGrouped ? '🛑 ' : '👊 '}
                  </span>
                ) : null}
                <span {...column.getSortByToggleProps()}>
                  {column.render('Header')}
                  {column.canResize && (
                    <div
                      {...column.getResizerProps()}
                      className={clsx(styles.resizer, column.isResizing && styles.isResizing)}
                    />
                  )}
                  {column.isSorted
                    ? column.isSortedDesc
                      ? ' 🔽'
                      : ' 🔼'
                    : ''}
                </span>
              </div>
              <div>{column.canFilter ? column.render('Filter') : null}</div>
              {showColumnOptionsMenu && column.id === columnId && (
                <ColumnOptionsMenu
                  addColumn={addColumn}
                  columnId={columnId}
                  onClose={() => setShowColumnOptionsMenu(false)}
                  setColumns={setColumns}
                  xPos={xPos}
                  yPos={yPos}
                />
              )}
            </th>
          ))}
          { /* <th><button onClick={() => addColumn('left')}>add column</button></th> */ }
        </tr>
      ))}
    </thead>
  )
}

export default TableHead
