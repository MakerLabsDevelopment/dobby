import React, { useEffect, Suspense } from 'react'
import { connect } from 'redux-bundler-react'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { Loading } from '../components/Loading'
import { Tables } from '../components/Tables'
import { RootPage } from '../components/RootPage'
import Table from '../components/table/Table'
import {
  activeBase,
  activeBaseId,
  activeTableId,
  activeTable,
  activeTableRows,
  dobbyRepoWrapper
} from '../state'

import styles from './BasePage.module.css'
import { newBaseId, newTableId, ColumnID, CellValue } from '../model/model'

interface IBasePage {
  routeParams: any
}

const BasePageComponent = ({
  routeParams: { baseId, tableId },
}: IBasePage) => {
  const setActiveBaseId = useSetRecoilState(activeBaseId)
  useEffect(() => {
    setActiveBaseId(newBaseId(baseId))
  }, [baseId, setActiveBaseId])

  const setActiveTableId = useSetRecoilState(activeTableId)
  useEffect(() => {
    const id = tableId != null ? newTableId(tableId) : null
    setActiveTableId(id)
  }, [tableId, setActiveTableId])


  //TODO implement in terms of DobbyRepo
  const collectionCreate = () => console.log("create!")

  return (
    <RootPage>
      <div className={styles.optionsRow}>
        <Suspense fallback={<Loading />}>
          <Tables />
        </Suspense>
        <div className={styles.plusButton} onClick={collectionCreate}>
          +
        </div>
      </div>
      <Suspense fallback={<Loading />}>
        <CurrentTable />
      </Suspense>
    </RootPage>
  )
}

const CurrentTable = () => {
  const theActiveBase = useRecoilValue(activeBase)
  const activeTableVal = useRecoilValue(activeTable)
  const activeTableRowsVal = useRecoilValue(activeTableRows)
  const repo = useRecoilValue(dobbyRepoWrapper).repo
  if (theActiveBase == null) {
    return <p>Base does not exist</p>
  }
  if (activeTableVal == null) {
    return <p>"No tables in this base yet"</p>
  }

  const insertRow = async (index: number, values: Map<ColumnID, CellValue>): Promise<void> => {
      await repo.insertRow(theActiveBase.id, activeTableVal.id, index, values)
  }

  const insertColumn = async (index: (number | null)): Promise<void> => {
      await repo.insertColumn(theActiveBase.id, activeTableVal.id, index)
  }

  const updateColumn = async (columnId: ColumnID, description: string): Promise<void> => {
      await repo.updateColumn(theActiveBase.id, activeTableVal.id, columnId, description, null)
  }

  return (
    <Table
      table={activeTableVal}
      tableRows={activeTableRowsVal}
      insertRow={insertRow}
      insertColumn={insertColumn}
      updateColumn={updateColumn}
    />
  )
}

const BasePage = connect(
  'selectRouteParams',
  BasePageComponent,
)

export { BasePage }
