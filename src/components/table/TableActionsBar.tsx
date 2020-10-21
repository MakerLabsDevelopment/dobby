import React, { useState } from 'react'
import GlobalFilter from './GlobalFilter'
import FilterMenu from './FilterMenu'
import styles from './TableActionsBar.module.css'

interface TableActionsBarProps {
  headerGroups: []
  globalFilter: any
  preGlobalFilteredRows: []
  setGlobalFilter: (value: any) => any
}

const TableActionsBar = ({
  headerGroups,
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}: TableActionsBarProps) => {
  const [showFilterMenu, setShowFilterMenu] = useState(false)

  return (
    <div className={styles.container}>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <button
        className={styles.addColumnButton}
        onClick={() => setShowFilterMenu(true)}
      >
        filter
      </button>
      {showFilterMenu && (
        <FilterMenu
          headerGroups={headerGroups}
          setGlobalFilter={setGlobalFilter}
          onClose={() => setShowFilterMenu(false)}
        />
      )}
    </div>
  )
}

export default TableActionsBar
