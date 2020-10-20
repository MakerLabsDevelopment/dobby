import React, { useState } from 'react'
import RowOptionsMenu from './RowOptionsMenu'
import styles from './TableBody.module.css'


interface TableBodyProps {
  data: Object[]
  page: any[]
  getTableBodyProps: () => any
  prepareRow: (row: any) => any
  setData: (data: Object[]) => any
}

const TableBody = ({
  data,
  getTableBodyProps,
  page,
  prepareRow,
  setData
}: TableBodyProps) => {
  const [showRowOptionsMenu, setShowRowOptionsMenu] = useState(false)
  const [xPos, setXPost] = useState('')
  const [yPos, setYPos] = useState('')
  const [rowId, setRowId] = useState('')

  const onRightClickRow = (e, id) => {
    e.preventDefault()
    setXPost(e.pageX + "px")
    setYPos(e.pageY + "px")
    setRowId(id)
    setShowRowOptionsMenu(true)
  }

  const addRow = () => {
    const emptyRowObject = { _id: Math.random().toString(36), name: "", count: 0 }
    setData([...data, emptyRowObject])
    // doCollectionsAddRow(name, emptyRowObject)
  }

  return (
    <tbody {...getTableBodyProps()} className={styles.tableBody}>
      {page.map((row: any) => {
        prepareRow(row)
        return (
          <tr
            {...row.getRowProps()}
            onContextMenu={(e) => onRightClickRow(e, row.values._id)}
          >
            {row.cells.map((cell: any) => {
              return (
                <td {...cell.getCellProps()}>
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
                  {showRowOptionsMenu && row.values._id === rowId && (
                    <RowOptionsMenu
                      onClose={() => setShowRowOptionsMenu(false)}
                      rowId={rowId}
                      xPos={xPos}
                      yPos={yPos}
                    />
                  )}
                </td>
              )
            })}
          </tr>
        )
      })}
      <tr><td><button onClick={addRow}>add row</button></td></tr>
    </tbody>
  )
}

export default TableBody
