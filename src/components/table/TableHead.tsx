import React, { useState } from 'react'
import ColumnOptionsMenu from './ColumnOptionsMenu'
import styles from './TableHead.module.css'

interface TableHeadProps {
  headerGroups: []
  setColumns: (old: any) => any
  addColumn: (index?: number) => any
  renameColumn: (columnId: any, description: string) => any
}

const TableHead = ({ headerGroups, addColumn, renameColumn, setColumns }: TableHeadProps) => {
  const [columnId, setColumnId] = useState('')
  const [showColumnOptionsMenu, setShowColumnOptionsMenu] = useState(false)

  const onRightClickColumn = (e: any, columnId: string) => {
    e.preventDefault()
    setColumnId(columnId)
    setShowColumnOptionsMenu(true)
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
                    headers={headerGroup.headers}
                    onClose={() => setShowColumnOptionsMenu(false)}
                    renameColumn={renameColumn}
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
        onClick={() => addColumn()}
      >
        add column
      </button>
    </div>
  )
}

export default TableHead
