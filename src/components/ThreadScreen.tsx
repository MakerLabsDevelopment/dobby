import React from 'react'
import { connect } from 'redux-bundler-react'
import BaseScreen from './BaseScreen'
import CollectionTabs from './CollectionTabs'
import Table from './table/Table'

interface ThreadScreenProps {
  collectionsList: any
}

const ThreadScreen = ({ collectionsList }: ThreadScreenProps) => (
  <>
    {collectionsList && (
      <BaseScreen>
        <CollectionTabs />
        <Table />
      </BaseScreen>
    )}
  </>
)

export default connect(
  'selectCollectionsList',
  ThreadScreen
)
