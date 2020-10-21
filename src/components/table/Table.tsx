// @ts-nocheck
import React, { useEffect, useState, useMemo, useRef } from 'react'
import matchSorter from 'match-sorter'
import { connect } from 'redux-bundler-react'
import {
  useTable,
  usePagination,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useGroupBy,
  useRowSelect,
  useBlockLayout,
  useResizeColumns,
  TableInstance,
} from 'react-table'
import GlobalFilter from './GlobalFilter'
import { IndeterminateCheckbox } from './Checkbox'
import TableActionsBar from './TableActionsBar'
import TableHead from './TableHead'
import TableBody from './TableBody'
import Pagination from './Pagination'
import EditableCell from './EditableCell'
import styles from './Table.module.css'

type Data = object

interface TableProps {
  collectionsActive: any
  collectionsData: any
  doCollectionsAddColumn: (name: string, schema_type: string) => any
  doCollectionsAddRow: (name: string, emptyRow: any) => any
  doCollectionsDeleteRow: (name: string, instanceId: string) => any
  doCollectionsFetchData: (name: string) => any
  doCollectionsUpdateSave: (name: string, data: any) => any
  routeParams: any
}

const Table = ({
  collectionsActive,
  collectionsData,
  doCollectionsAddColumn,
  doCollectionsAddRow,
  doCollectionsDeleteRow,
  doCollectionsFetchData,
  doCollectionsUpdateSave,
  routeParams,
}: TableProps) => {
  const name = routeParams.collectionName
  const [columns, setColumns] = useState([
      {
        Header: 'id',
        accessor: '_id',
        type: 'single_line_text',
        filter: 'fuzzyText',
      },
      {
        Header: 'Name',
        accessor: 'name',
        type: 'single_line_text',
        filter: 'fuzzyText',
        aggregate: 'count',
        Aggregated: ({ value }) => `${value} Names`,
      },
      {
        Header: 'Missions',
        accessor: 'missions',
        type: 'number',
        filter: 'fuzzyText',
        aggregate: 'uniqueCount',
        Aggregated: ({ value }) => `${value} Unique Names`,
      },
    ],
  )
  const [data, setData] = useState([])
  const [skipPageReset, setSkipPageReset] = useState(false)
  const skipResetRef = useRef(false)
  const skipReset = skipResetRef.current

  useEffect(() => {
    if (collectionsData) {
      setData(collectionsData)
    } else {
      // doCollectionsFetchData(name)
    }
  }, [name, collectionsActive, collectionsData])

  useEffect(() => {
    if (data.length > 1) {
      doCollectionsUpdateSave(name, data)
    }
  }, [data])

  const updateMyData = async (
    rowIndex: number,
    columnId: string,
    value: any,
  ) => {
    console.log(data, 'DATAs')
    setSkipPageReset(true)
    setData((old: any) =>
      old.map((row: any, index: number) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          }
        }
        return row
      }),
    )
  }

  const fuzzyTextFilterFn = (rows: any, id: string, filterValue: string) => {
    return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
  }

  fuzzyTextFilterFn.autoRemove = val => !val

  const filterTypes = useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    [],
  )

  const defaultColumn = useMemo(
    () => ({
      Filter: GlobalFilter,
      Cell: EditableCell,
      minWidth: 30,
      width: 150,
      maxWidth: 400,
    }),
    [],
  )

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
  } = useTable<Data>(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      initialState: { pageSize: 30 },
      autoResetPage: !skipPageReset,
      updateMyData,
      autoResetPage: !skipReset,
      autoResetSelectedRows: !skipReset,
      disableMultiSort: true,
    },
    useFilters,
    useGlobalFilter,
    useGroupBy,
    useSortBy,
    usePagination,
    useRowSelect,
    useBlockLayout,
    useResizeColumns,
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
  ) as TableInstance<object>
  useEffect(() => { setSkipPageReset(false) }, [data])
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
          name={name}
          setColumns={setColumns}
        />
        <TableBody
          data={data}
          getTableBodyProps={getTableBodyProps}
          page={page}
          prepareRow={prepareRow}
          setData={setData}
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
        gotoPage={gotoPage}
        setPageSize={setPageSize}
        pageIndex={pageIndex}
        pageSize={pageSize}
      />
    </>
  )
}

export default connect(
  'doCollectionsAddColumn',
  'doCollectionsAddRow',
  'doCollectionsDeleteRow',
  'doCollectionsFetchData',
  'doCollectionsUpdateSave',
  'selectCollectionsActive',
  'selectCollectionsData',
  'selectRouteParams',
  Table,
)
