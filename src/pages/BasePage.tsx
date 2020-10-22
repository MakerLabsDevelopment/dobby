import React, { useEffect, Suspense } from 'react'
import { connect } from 'redux-bundler-react'
import { useSetRecoilState } from 'recoil'
import { Loading } from '../components/Loading'
import { Tables } from '../components/Tables'
import { RootPage } from '../components/RootPage'
import Table from '../components/table/Table'
import {
  activeBaseId,
} from '../state'

import styles from './BasePage.module.css'
import { newBaseId } from '../model/model'

interface IBasePage {
  routeParams: any
}

const BasePageComponent = ({
  routeParams: { baseId },
}: IBasePage) => {
  const setActiveBaseId = useSetRecoilState(activeBaseId)
  useEffect(() => {
    setActiveBaseId(newBaseId(baseId))
  }, [baseId, setActiveBaseId])

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
      <Table />
    </RootPage>
  )
}

const BasePage = connect(
  'selectRouteParams',
  BasePageComponent,
)

export { BasePage }
