import React, { useEffect, useState, useRef } from 'react'
import styles from './ColumnOptionsMenu.module.css'

const menuTypes = [
  'link to another record',
  'single_line_text',
  'long_text',
  'attachments',
  'checkbox',
  'multiselect',
  'single_select',
  'collaborator',
  'date',
  'phone_number',
  'email',
  'url',
  'number',
  'currency',
  'percentage',
  'duration',
  'rating',
  'formula',
  'rollup',
  'count',
  'lookup',
  'created_time',
  'last_modified_time',
  'created_by',
  'last_modified_by',
  'autonumber',
  'barcode',
  'button'
]

type ColumnOptionsMenuProps = {
  addColumn: (columnId: string, direction: string) => any
  column: any,
  columnId: any,
  onClose: () => any,
  setColumns: (old: object) => any,
}

const ColumnOptionsMenu = ({
  addColumn,
  column,
  columnId,
  onClose,
  setColumns,
}: ColumnOptionsMenuProps) => {
  const [dropDown, setDropDown] = useState('options')
  const [colName, setColName] = useState('')

  const useOutsideAlerter = (ref: any) => {
    useEffect(() => {
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          setDropDown('options')
          onClose()
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

  const renameColumn = async (columnId: string, newName: string) => {
    setColumns(old =>
      old.map((row) => {
        for (var i in row.columns) {
          if (row.columns[i].accessor === columnId) {
            row.columns[i].Header = newName
            break
          }
        }
        return row
      })
    )
  }

  const changeColumnType = async (columnId: string, type: string) => {
    setColumns(old =>
      old.map((row) => {
        for (var i in row.columns) {
          if (row.columns[i].accessor === columnId) {
            row.columns[i].type = type
            break
          }
        }
        return row
      })
    )
  }

  const removeColumn = (columnId: string) => {
    setColumns(old =>
      old.map((row) => {
        return {
          columns: row.columns.filter((col) => col.accessor !== columnId)
        }
      })
    )
  }

  const sortColumnDesc = () => {
    !column.isSorted ? column.toggleSortBy(true) : column.clearSortBy()
    onClose()
  }

  const sortColumnAsc = () => {
    !column.isSorted ? column.toggleSortBy(false) : column.clearSortBy()
    onClose()
  }


  return (
    <div
      className={styles.menu}
      ref={wrapperRef}
    >
      {dropDown === 'options' && (
        <div>
          <div className={styles.menuItem} onClick={() => setDropDown('select_type')}>customise type</div>
          <div className={styles.menuItem} onClick={() => setDropDown('rename')}>rename</div>
          <div className={styles.menuItem} onClick={() => addColumn('left', columnId)}>insert left</div>
          <div className={styles.menuItem} onClick={() => addColumn('right', columnId)}>insert right</div>
          <div className={styles.menuItem} onClick={() => sortColumnDesc()}>sort A-Z</div>
          <div className={styles.menuItem} onClick={() => sortColumnAsc()}>sort Z-A</div>
          <div className={styles.menuItem}>add filter</div>
          <div className={styles.menuItem}>group by field</div>
          <div className={styles.menuItem} onClick={() => removeColumn(columnId)}>delete column</div>
        </div>
      )}
      {dropDown === 'rename' && (
        <div>
          <input type="text" value={colName} onChange={e => setColName(e.target.value)}/>
          <div className={styles.menuItem} onClick={() => renameColumn(columnId, colName)}>save</div>
        </div>
      )}
      {dropDown === 'select_type' && (
        <div>
          {menuTypes && menuTypes.map((type: string, index: number) => (
            <div
              key={index}
              className={styles.menuItem}
              onClick={() => changeColumnType(columnId, type)}
            >
              { type }
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ColumnOptionsMenu
