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
  addColumn: (index?: number) => any
  changeColumnType: (columnId: any, type: string) => any
  column: any
  columnId: any
  headers: []
  onClose: () => any
  renameColumn: (columnId: any, description: string) => any
  removeColumn: (columnId: any) => any
}

const ColumnOptionsMenu = ({
  addColumn,
  changeColumnType,
  column,
  columnId,
  headers,
  onClose,
  renameColumn,
  removeColumn,
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

  const sortColumn = (direction: ('asc' | 'desc')) => {
    //TODO: insert desction check and sort accordingly
    !column.isSorted ? column.toggleSortBy(true) : column.clearSortBy()
    onClose()
  }

  const colIndex = headers.findIndex((col: any) => col?.id === columnId)

  return (
    <div
      className={styles.menu}
      ref={wrapperRef}
    >
      {dropDown === 'options' && (
        <div>
          <div className={styles.menuItem} onClick={() => setDropDown('select_type')}>customise type</div>
          <div className={styles.menuItem} onClick={() => setDropDown('rename')}>rename</div>
          <div className={styles.menuItem} onClick={() => addColumn(colIndex)}>insert left</div>
          <div className={styles.menuItem} onClick={() => addColumn(colIndex + 1)}>insert right</div>
          <div className={styles.menuItem} onClick={() => sortColumn('desc')}>sort A-Z</div>
          <div className={styles.menuItem} onClick={() => sortColumn('asc')}>sort Z-A</div>
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
