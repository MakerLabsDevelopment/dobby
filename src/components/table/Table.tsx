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
  updateRow: (rowId: RowID, newValues: Map<ColumnID, CellValue>) => Promise<void>,
  insertColumn: (index: (number | null)) => Promise<void>,
  updateColumn: (columnId: ColumnID, description: string, type: any) => Promise<void>
  deleteColumn: (columnId: ColumnID) => Promise<void>
}

const Table = ({
  table,
  tableRows,
  insertRow,
  updateRow,
  insertColumn,
  updateColumn,
  deleteColumn
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
    } else if (c.type === "long_text") {
      colType = "long_text"
      filter = "fuzzy"
    } else if (c.type === "checkbox") {
      colType = "checkbox"
      filter = "boolean"
    } else if (c.type === "single_select") {
      colType = "single_select"
      filter = "includes"
    } else if (c.type === "multi_select") {
      colType = "multi_select"
      filter = "includes"
    } else if (c.type === "email") {
      colType = "email"
      filter = "fuzzy"
    } else if (c.type === "url") {
      colType = "url"
      filter = "fuzzy"
    } else if (c.type === "phone_number") {
      colType = "phone_number"
      filter = "exact"
    } else if (c.type === "percentage") {
      colType = "percentage"
      filter = "exact"
    } else if (c.type === "currency") {
      colType = "currency"
      filter = "exact"
    } else if (c.type === "attachment") {
      colType = "attachment"
      filter = "exact"
    } else if (c.type === "date") {
      colType = "date"
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
        } else {
          return cellVal.value
        }
      },
      type: colType,
      filter,
    }
  })

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
      // TODO: add column types
      for (const column of table.columns) {
          if (["string", "email", "url"].includes(column.type)) {
              values.set(column.id, {
                  type: column.type,
                  value: "",
              })
          } else if (column.type === "number") {
              values.set(column.id, {
                  type: "number",
                  value: 0,
              })
          } else if (column.type === "long_text") {
              values.set(column.id, {
                  type: "long_text",
                  value: "",
              })
          } else if (column.type === "checkbox") {
              values.set(column.id, {
                  type: "checkbox",
                  value: false,
              })
          } else if (column.type === "single_select") {
              values.set(column.id, {
                  type: "single_select",
                  value: { options: [], selectedIndex: 0 },
              })
          } else if (column.type === "multi_select") {
              values.set(column.id, {
                  type: "multi_select",
                  value: [{ label: "", selected: false }],
              })
          } else if (column.type === "phone_number") {
              values.set(column.id, {
                  type: "phone_number",
                  value: "",
              })
          } else if (column.type === "percentage") {
              values.set(column.id, {
                  type: "percentage",
                  value: "",
              })
          } else if (column.type === "currency") {
              values.set(column.id, {
                  type: "currency",
                  value: "",
              })
          } else if (column.type === "attachment") {
              values.set(column.id, {
                  type: "attachment",
                  value: [],
              })
          } else if (column.type === "date") {
              values.set(column.id, {
                  type: "date",
                  value: "",
              })
          }
      }
      await insertRow(index, values)
      return
  }

  const updateMyData = async (index: number, columnId: string, value: any): Promise<void> => {
      const rowId = tableRows[index].id
      const column = table.columns.find((col: any) => col.id.value === columnId)
      const values: Map<ColumnID, CellValue> = new Map()
      values.set(column.id, { type: column.type, value: value })
      await updateRow(rowId, values)
      return
  }

  const addColumn = async (index: (number | null)): Promise<void> => {
      await insertColumn(index)
      return
  }

  const renameColumn = async (columnId: string, description: string): Promise<void> => {
    const column = table.columns.find((col: any) => col.id.value === columnId)
    await updateColumn(column.id, description)
    return
  }

  const changeColumnType = async (columnId: string, type: string): Promise<void> => {
    const column = table.columns.find((col: any) => col.id.value === columnId)
    await updateColumn(column.id, null, type)
    return
  }

  const removeColumn = async (columnId: string): Promise<void> => {
    const column = table.columns.find((col: any) => col.id.value === columnId)
    await deleteColumn(column.id)
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
      updateMyData
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
          changeColumnType={changeColumnType}
          removeColumn={removeColumn}
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
    width: 180,
    maxWidth: 400,
}

export default Table
