// @ts-nocheck
import React, { useEffect, useState, useMemo, useRef, forwardRef } from 'react'
import matchSorter from 'match-sorter'
import { connect } from 'redux-bundler-react'
import {
  useTable,
  usePagination,
  useSortBy,
  useFilters,
  useGroupBy,
  useRowSelect,
  TableInstance
} from 'react-table'
import Pagination from './Pagination'
import EditableCell from './EditableCell'
import './Table.css'

type TableProps = {
  collectionsActive: any
  collectionsData: any
  doCollectionsAddRow: (name: string, emptyRow: any) => any
  doCollectionsDeleteRow: (name: string, instanceId: string) => any
  doCollectionsFetchData: (name: string) => any
  routeParams: any
}

type Data = object

const IndeterminateCheckbox = forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = useRef()
    const resolvedRef = ref || defaultRef

    useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    )
  }
)

const Table = ({
  collectionsActive,
  collectionsData,
  doCollectionsAddRow,
  doCollectionsDeleteRow,
  doCollectionsFetchData,
  routeParams
}: TableProps) => {
  const name = routeParams.collectionName
  const [columns, setColumns] = useState([
      {
        Header: name || 'table',
        columns: [
          {
            Header: 'id',
            accessor: '_id'
          },
          {
            Header: 'Name',
            accessor: 'name',
            aggregate: 'count',
            Aggregated: ({ value }) => `${value} Names`,
          },
          {
            Header: 'Missions',
            accessor: 'missions',
            filter: 'fuzzyText',
            aggregate: 'uniqueCount',
            Aggregated: ({ value }) => `${value} Unique Names`,
          },
        ],
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
      doCollectionsFetchData(name)
    }
  }, [name, collectionsActive, collectionsData])

  // useEffect(() => {
  //   if (data.length > 1) {
  //     doCollectionsUpdate(name, data)
  //   }
  // }, [data])

  const updateMyData = async (rowIndex: number, columnId: string, value: any) => {
    setSkipPageReset(true)
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          }
        }
        return row
      })
    )
  }

  const addRow = () => {
    const emptyRowObject = { _id: Math.random().toString(36), name: "", count: 0 }
    setData([...data, emptyRowObject])
    doCollectionsAddRow(name, emptyRowObject)
  }

  const removeRow = async (instanceId: string) => {
    doCollectionsDeleteRow(name, instanceId)
  }

  const addColumn = async () => {
    const newColData = { Header: 'Field', accessor: 'field' }
    setColumns(old =>
      old.map((row) => {
        return {
          Header: name,
          columns: [...row.columns, newColData]
        }
      })
    )
    // @ts-ignore
    schema.properties.field = { type: 'string' }
    doCollectionsAddColumn(name, schema)
  }

  const ContextMenu = ({ yPos, xPos }) => (
    <div
      className='menu'
      style={{ top: yPos, left: xPos }}
      onClick={() => removeRow(rowId)}
    >
      delete row
    </div>
  )

  const [showContext, setShowContext] = useState(false)
  const [xPos, setXPost] = useState('')
  const [yPos, setYPos] = useState('')
  const [rowId, setRowId] = useState('')
  const onRightClickRow = (e, id) => {
    e.preventDefault()
    setXPost(e.pageX + "px")
    setYPos(e.pageY + "px")
    setRowId(id)
    setShowContext(true)

  }

  // Define a default UI for filtering
  const DefaultColumnFilter = ({
    column: { filterValue, preFilteredRows, setFilter },
  }) => {
    const count = preFilteredRows.length

    return (
      <input
        value={filterValue || ''}
        onChange={e => {
          setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
        }}
        placeholder={`Search ${count} records...`}
      />
    )
  }

  // This is a custom filter UI for selecting
  // a unique option from a list
  const SelectColumnFilter = ({
    column: { filterValue, setFilter, preFilteredRows, id },
  }) => {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = useMemo(() => {
      const options = new Set()
      preFilteredRows.forEach(row => {
        options.add(row.values[id])
      })
      return [...options.values()]
    }, [id, preFilteredRows])

    // Render a multi-select box
    return (
      <select
        value={filterValue}
        onChange={e => {
          setFilter(e.target.value || undefined)
        }}
      >
        <option value="">All</option>
        {options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
    )
  }

  // This is a custom filter UI that uses a
  // slider to set the filter value between a column's
  // min and max values
  const SliderColumnFilter = ({
    column: { filterValue, setFilter, preFilteredRows, id },
  }) => {
    // Calculate the min and max
    // using the preFilteredRows

    const [min, max] = React.useMemo(() => {
      let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
      let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
      preFilteredRows.forEach(row => {
        min = Math.min(row.values[id], min)
        max = Math.max(row.values[id], max)
      })
      return [min, max]
    }, [id, preFilteredRows])

    return (
      <>
        <input
          type="range"
          min={min}
          max={max}
          value={filterValue || min}
          onChange={e => {
            setFilter(parseInt(e.target.value, 10))
          }}
        />
        <button onClick={() => setFilter(undefined)}>Off</button>
      </>
    )
  }

  // This is a custom UI for our 'between' or number range
  // filter. It uses two number boxes and filters rows to
  // ones that have values between the two
  const NumberRangeColumnFilter = ({
    column: { filterValue = [], preFilteredRows, setFilter, id },
  }) => {
    const [min, max] = React.useMemo(() => {
      let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
      let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
      preFilteredRows.forEach(row => {
        min = Math.min(row.values[id], min)
        max = Math.max(row.values[id], max)
      })
      return [min, max]
    }, [id, preFilteredRows])

    return (
      <div
        style={{
          display: 'flex',
        }}
      >
        <input
          value={filterValue[0] || ''}
          type="number"
          onChange={e => {
            const val = e.target.value
            setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]])
          }}
          placeholder={`Min (${min})`}
          style={{
            width: '70px',
            marginRight: '0.5rem',
          }}
        />
        to
        <input
          value={filterValue[1] || ''}
          type="number"
          onChange={e => {
            const val = e.target.value
            setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined])
          }}
          placeholder={`Max (${max})`}
          style={{
            width: '70px',
            marginLeft: '0.5rem',
          }}
        />
      </div>
    )
  }

  const fuzzyTextFilterFn = (rows, id, filterValue) => {
    return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
  }

  // Let the table remove the filter if the string is empty
  fuzzyTextFilterFn.autoRemove = val => !val

  const filterTypes = useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  )

  const defaultColumn = useMemo(
   () => ({
     Filter: DefaultColumnFilter,
     Cell: EditableCell,
   }),
   []
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
      pageIndex,
      pageSize,
    },
  } = useTable<Data>(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      autoResetPage: !skipPageReset,
      updateMyData,
      autoResetPage: !skipReset,
      autoResetSelectedRows: !skipReset,
      disableMultiSort: true,
    },
    useFilters,
    useGroupBy,
    useSortBy,
    usePagination,
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => {
        return [
          {
            id: 'selection',
            // Make this column a groupByBoundary. This ensures that groupBy columns
            // are placed after it
            groupByBoundary: true,
            // The header can use the table's getToggleAllRowsSelectedProps method
            // to render a checkbox
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <div>
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              </div>
            ),
            // The cell can use the individual row's getToggleRowSelectedProps method
            // to the render a checkbox
            Cell: ({ row }) => (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            ),
          },
          ...columns,
        ]
      })
    }
  ) as TableInstance<object>
  useEffect(() => { setSkipPageReset(false) }, [data])
  // headerGroups.shift()
  return (
    <>
      {showContext && <ContextMenu xPos={xPos} yPos={yPos} />}
      <div className='tableContainer'>
        <table {...getTableProps()} >
          <thead>
            {headerGroups.map((headerGroup: any) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column: any) => (
                  <th {...column.getHeaderProps()}>
                    <div>
                      {column.canGroupBy ? (
                        <span {...column.getGroupByToggleProps()}>
                          {column.isGrouped ? '🛑 ' : '👊 '}
                        </span>
                      ) : null}
                      <span {...column.getSortByToggleProps()}>
                        {column.render('Header')}
                        {column.isSorted
                          ? column.isSortedDesc
                            ? ' 🔽'
                            : ' 🔼'
                          : ''}
                      </span>
                    </div>
                    <div>{column.canFilter ? column.render('Filter') : null}</div>
                  </th>
                ))}
                <th><button onClick={addColumn}>add column</button></th>
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
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
                          // If it's a grouped cell, add an expander and row count
                          <>
                            {cell.render('Cell', { editable: false })} (
                            {row.subRows.length})
                          </>
                        ) : cell.isAggregated ? (
                          // If the cell is aggregated, use the Aggregated
                          // renderer for cell
                          cell.render('Aggregated')
                        ) : cell.isPlaceholder ? null : ( // For cells with repeated values, render null
                          // Otherwise, just render the regular cell
                          cell.render('Cell', { editable: true })
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
        <button onClick={addRow}>add row</button>
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
  'doCollectionsAddRow',
  'doCollectionsDeleteRow',
  'doCollectionsFetchData',
  'selectCollectionsActive',
  'selectCollectionsData',
  'selectRouteParams',
  Table
)
