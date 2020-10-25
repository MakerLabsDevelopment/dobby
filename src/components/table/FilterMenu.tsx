// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react'
import styles from './FilterMenu.module.css'

type FilterMenuProps = {
  headerGroups: []
  onClose: () => any
  setGlobalFilter: (value: any) => any
}

const FilterMenu = ({
  headerGroups,
  onClose,
  setGlobalFilter,
}: FilterMenuProps) => {
  const [columnId, setColumnId] = useState<string>()
  const [columnValue, setColumnValue] = useState<string>()
  const [filterType, setFilterType] = useState<string>()

  useEffect(() => {
    setColumnId(headerGroups[0].headers[0].id)
  }, [headerGroups])

  const useOutsideAlerter = (ref: any) => {
    useEffect(() => {
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
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

  const selectColumn = (e: any) => {
    const column = headerGroups[0].headers.find((column: any) => column.Header === e.target.value)
    setColumnValue(e.target.value)
    setColumnId(column.id)
  }
  const selectedColumn = headerGroups[0].headers.find((column: any) => column.id === columnId)

  const selectFilterType = (e: any) => {
    setFilterType(e.target.value)
    setGlobalFilter(e.target.value)
  }
  return (
    <div
      className={styles.container}
      ref={wrapperRef}
    >
      <div className={styles.filterRow}>
        <div onClick={onClose}>x</div>
        <div>Where</div>
        {headerGroups.map((headerGroup: any, index: number) => (
          <select key={index} onChange={selectColumn} value={columnValue}>
            {headerGroup.headers.map((column: any, index: number) => {
              return <option key={index} value={column.Header.toString()}>{column.Header}</option>
            })}
          </select>
        ))}
        <select onChange={selectFilterType} value={filterType}>
          <option value='equals'>Equals</option>
          <option value='includes'>Includes</option>
        </select>
        <div>{selectedColumn && selectedColumn.render('Filter')}</div>
      </div>
    </div>
  )
}

export default FilterMenu
