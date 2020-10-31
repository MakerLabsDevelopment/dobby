import React, { useState } from 'react'
import RowOptionsMenu from './RowOptionsMenu'
import styles from './TableBody.module.css'
import {Row, RowID, equalIds} from '../../model'
import type { Row as ReactTableRow } from "react-table"


interface TableBodyProps {
  data: Row[]
  page: ReactTableRow<Row>[]
  getTableBodyProps: () => any
  prepareRow: (row: ReactTableRow<Row>) => any
  addEmptyRow: (index?: number) => Promise<void>
}

const TableBody = ({
  getTableBodyProps,
  page,
  prepareRow,
  addEmptyRow,
}: TableBodyProps) => {
  const [showRowOptionsMenu, setShowRowOptionsMenu] = useState(false)
  const [xPos, setXPos] = useState('')
  const [yPos, setYPos] = useState('')
  const [rowId, setRowId] = useState<null | RowID>(null)

  const onRightClickRow = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: RowID) => {
    e.preventDefault()
    setXPos(e.pageX + "px")
    setYPos(e.pageY + "px")
    setRowId(id)
    setShowRowOptionsMenu(true)
  }

  return (
    <div {...getTableBodyProps()} className={styles.tableBody}>
      {page.map((row) => {
        prepareRow(row)
        return (
          <div
            {...row.getRowProps()}
            onContextMenu={(e) => onRightClickRow(e, row.values._id)}
          >
            {row.cells.map((cell: any) => {
              return (
                <div {...cell.getCellProps()} className={styles.tableData}>
                  {cell.isGrouped ? (
                    <>
                      {cell.render('Cell', { editable: false })} (
                      {row.subRows.length})
                    </>
                  ) : cell.isAggregated ? (
                    cell.render('Aggregated')
                  ) : cell.isPlaceholder ? null : (
                    cell.render('Cell', { editable: true })
                  )}
                  {showRowOptionsMenu && (rowId != null ? equalIds(row.original.id, rowId) : false) && (
                    <RowOptionsMenu
                      onClose={() => setShowRowOptionsMenu(false)}
                      rowId={rowId}
                      xPos={xPos}
                      yPos={yPos}
                    />
                  )}
                </div>
              )
            })}
          </div>
        )
      })}
    <button onClick={() => addEmptyRow()}>add row</button>
    </div>
  )
}

export default TableBody
