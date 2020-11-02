// @ts-nocheck
import React, { useMemo } from 'react'
import matchSorter from 'match-sorter'
import {
  useTable,
  usePagination,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useGroupBy,
  useRowSelect,
  useBlockLayout,
  TableInstance,
  FilterTypes,
} from 'react-table'
import type {Row as ReactTableRow, Column as ReactTableColumn } from "react-table"
import GlobalFilter from './GlobalFilter'
import { IndeterminateCheckbox } from './Checkbox'
import TableActionsBar from './TableActionsBar'
import TableHead from './TableHead'
import TableBody from './TableBody'
import Pagination from './Pagination'
import EditableCell from './EditableCell'
import styles from './Table.module.css'
import type { Table as ModelTable, Row, ColumnID } from '../../model'

interface TableProps {
  table: ModelTable,
  tableRows: Row[],
  insertRow: (index: number, values: Map<ColumnID, CellValue>) => Promise<void>,
  insertColumn: (index: (number | null)) => Promise<void>,
  updateColumn: (columnId: ColumnID, description: string) => Promise<void>
}

const Table = ({
  table,
  tableRows,
  insertRow,
  insertColumn,
  updateColumn
}: TableProps) => {
  const columns: Array<ReactTableColumn> = table.columns.map(c => {
    let colType = null
    let filter = null
    // TODO These types should be an enum somewhere
    if (c.type === "string") {
      colType = "single_line_text"
      filter = "fuzzy"
    } else if (c.type === "number") {
      colType = "number"
      filter = "exact"
    }
    return {
      Header: c.description,
      id: c.id.value,
      accessor: (r: Row): string => {
        const cellVal = r.cellValue(c.id)
        if (cellVal == null) {
          return ""
        }
        if (cellVal.type === "number") {
          return cellVal.value.toFixed(2)
        } else if (cellVal.type === "string") {
          return cellVal.value
        }
      },
      type: colType,
      filter,
    }
  })

  const setColumns = () => console.log("setting columns")


  const filterTypes: FilterTypes<Row> = useMemo(() => {
    const fuzzyTextFilterFn: FilterType<Row> = (rows: Array<ReactTableRow<Row>>, columnIds: Array<ColumnID>, filterValue: string): Array<ReactTableRow<Row>> => {
        return matchSorter(rows, filterValue, { keys: [row => columnIds.map(c => row[c])]})
    }
    fuzzyTextFilterFn.autoRemove = (val: any) => !val
    return {
        fuzzyText: fuzzyTextFilterFn,
    }
  }, [])

  const addEmptyRow = async (index: number): Promise<void> => {
      const values: Map<ColumnID, CellValue> = new Map()
      for (const column of table.columns) {
          if (column.type === "string") {
              values.set(column.id, {
                  type: "string",
                  value: "",
              })
          } else {
              values.set(column.id, {
                  type: "number",
                  value: 0,
              })
          }
      }
      await insertRow(index, values)
      return
  }

  const addColumn = async (index: (number | null)): Promise<void> => {
      await insertColumn(index)
      return
  }

  const renameColumn = async (columnId: ColumnID, description: string): Promise<void> => {
    await updateColumn(columnId, description)
    return
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: {
      globalFilter,
      pageIndex,
      pageSize,
    },
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable<Row>(
    {
      columns,
      data: tableRows,
      defaultColumn,
      filterTypes,
      initialState: { pageSize: 30 },
      disableMultiSort: true,
      autoResetHiddenColumns: false,
    },
    useFilters,
    useGlobalFilter,
    useGroupBy,
    useSortBy,
    usePagination,
    useRowSelect,
    useBlockLayout,
    hooks => {
      hooks.allColumns.push(columns => {
        return [
          {
            id: 'selection',
            groupByBoundary: true,
            disableResizing: true,
            minWidth: 35,
            width: 35,
            maxWidth: 35,
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <div>
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              </div>
            ),
            Cell: ({ row }) => (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            ),
          },
          ...columns,
        ]
      })
      hooks.useInstanceBeforeDimensions.push(({ headerGroups }) => {
        // fix the parent group of the selection button to not be resizable
        const selectionGroupHeader = headerGroups[0].headers[0]
        selectionGroupHeader.canResize = false
      })
    }
  ) as TableInstance<Row>
  return (
    <>
      <div className={styles.tableContainer} {...getTableProps()}>
        <TableActionsBar
          headerGroups={headerGroups}
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        <TableHead
          headerGroups={headerGroups}
          name={table.name}
          addColumn={addColumn}
          renameColumn={renameColumn}
          setColumns={setColumns}
        />
        <TableBody
          getTableBodyProps={getTableBodyProps}
          page={page}
          prepareRow={prepareRow}
          addEmptyRow={addEmptyRow}
        />
      </div>
      <Pagination
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        pageOptions={pageOptions}
        pageCount={pageCount}
        gotoPage={gotoPage}
        previousPage={previousPage}
        nextPage={nextPage}
        setPageSize={setPageSize}
        pageIndex={pageIndex}
        pageSize={pageSize}
      />
    </>
  )
}

const defaultColumn = {
    Filter: GlobalFilter,
    Cell: EditableCell,
    minWidth: 30,
    width: 150,
    maxWidth: 400,
}

export default Table
