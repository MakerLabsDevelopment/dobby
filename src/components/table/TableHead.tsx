import React, { useState } from 'react'
import ColumnOptionsMenu from './ColumnOptionsMenu'
import styles from './TableHead.module.css'

interface TableHeadProps {
  changeColumnType: (columnId: any, type: string) => any
  headerGroups: []
  addColumn: (index?: number) => any
  renameColumn: (columnId: any, description: string) => any
  removeColumn: (columnId: any) => any
}

const TableHead = ({ changeColumnType, headerGroups, addColumn, removeColumn, renameColumn }: TableHeadProps) => {
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
                      {column.isGrouped && '👊 '}
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
                    changeColumnType={changeColumnType}
                    columnId={columnId}
                    column={column}
                    headers={headerGroup.headers}
                    onClose={() => setShowColumnOptionsMenu(false)}
                    renameColumn={renameColumn}
                    removeColumn={removeColumn}
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
