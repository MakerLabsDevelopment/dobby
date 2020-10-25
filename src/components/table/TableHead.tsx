import React, { useState } from 'react'
import ColumnOptionsMenu from './ColumnOptionsMenu'
import styles from './TableHead.module.css'

interface TableHeadProps {
  headerGroups: []
  setColumns: (old: any) => any
}

const TableHead = ({ headerGroups, setColumns }: TableHeadProps) => {
  const [columnId, setColumnId] = useState('')
  const [showColumnOptionsMenu, setShowColumnOptionsMenu] = useState(false)

  const onRightClickColumn = (e: any, columnId: string) => {
    e.preventDefault()
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
    <div className={styles.tableHeaderContainer}>
      <div>
        {headerGroups.map((headerGroup: any) => (
          <div {...headerGroup.getHeaderGroupProps()} className={styles.headerRow}>
            {headerGroup.headers.map((column: any) => (
              <div
                className={styles.tableHeader}
                onContextMenu={(e) => onRightClickColumn(e, column.id)}
                {...column.getHeaderProps()}
              >
                <div>
                  {column.canGroupBy ? (
                    <span {...column.getGroupByToggleProps()}>
                      {column.isGrouped ? '🛑 ' : '👊 '}
                    </span>
                  ) : null}
                  <span>
                    {column.render('Header')}
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </div>
                {showColumnOptionsMenu && column.id === columnId && (
                  <ColumnOptionsMenu
                    addColumn={addColumn}
                    columnId={columnId}
                    column={column}
                    onClose={() => setShowColumnOptionsMenu(false)}
                    setColumns={setColumns}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <button
        className={styles.addColumnButton}
        onClick={() => addColumn('left')}
      >
        add column
      </button>
    </div>
  )
}

export default TableHead
