// @ts-nocheck
import React, { useEffect, useState } from 'react'
import { connect } from 'redux-bundler-react'
import { useTable, usePagination, TableInstance } from 'react-table'
import Pagination from './Pagination'
import EditableCell from './EditableCell'
import './Table.css'

type TableProps = {
  collectionsActive: any
  collectionsData: any
  doCollectionsFetchData: (name: string) => any
  routeParams: any
}

type Data = object

const Table = ({
  collectionsActive,
  collectionsData,
  doCollectionsFetchData,
  routeParams
}: TableProps) => {
  const name = routeParams.collectionName
  const [columns, setColumns] = useState([
      {
        Header: name || 'table',
        columns: [
          {
            Header: 'Name',
            accessor: 'name',
          },
          {
            Header: 'Missions',
            accessor: 'missions',
          },
        ],
      },
    ],
  )
  const [data, setData] = useState([])
  const [skipPageReset, setSkipPageReset] = useState(false)

  useEffect(() => {
    // collectionsActive && setSchema(collectionsActive.schema)
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

  // const removeRow = async (instanceId: string) => {
  //   doCollectionsDeleteRow(name, instanceId)
  // }

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



  const defaultColumn = {
    Cell: EditableCell,
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
    state: { pageIndex, pageSize },
  } = useTable<Data>(
    {
      columns,
      data,
      defaultColumn,
      autoResetPage: !skipPageReset,
      updateMyData,
    },
    usePagination
  ) as TableInstance<object>
  useEffect(() => { setSkipPageReset(false) }, [data])
  headerGroups.shift()
  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup: any) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row: any) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell: any) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
      <button onClick={addRow}>add row</button>
      <button onClick={addColumn}>add column</button>
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
  'doCollectionsFetchData',
  'selectCollectionsActive',
  'selectCollectionsData',
  'selectRouteParams',
  Table
)
