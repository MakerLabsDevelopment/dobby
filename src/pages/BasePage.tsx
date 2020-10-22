import React, { useEffect, Suspense } from 'react'
import { connect } from 'redux-bundler-react'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { Loading } from '../components/Loading'
import { Tables } from '../components/Tables'
import { RootPage } from '../components/RootPage'
import Table from '../components/table/Table'
import {
  activeBaseId,
  activeTableId,
  activeTable,
  activeTableRows,
} from '../state'

import styles from './BasePage.module.css'
import { newBaseId, newTableId } from '../model/model'

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
  const activeTableVal = useRecoilValue(activeTable)
  const activeTableRowsVal = useRecoilValue(activeTableRows)
  if (activeTableVal == null) {
    return <p>"No tables in this base yet"</p>
  }

  return <Table table={activeTableVal} tableRows={activeTableRowsVal}/>
}

const BasePage = connect(
  'selectRouteParams',
  BasePageComponent,
)

export { BasePage }
