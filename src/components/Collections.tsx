import React from 'react'
import { useRecoilValue } from 'recoil'
import { Collection } from './Collection'
import { collectionsQuerySelector } from '../state'
import styles from './Collections.module.css'

const Collections = () => {
  const collections = useRecoilValue(collectionsQuerySelector)
  return (
    <div className={styles.collections}>
      {collections?.map((collection: any) => (
        <Collection key={collection.id} collection={collection} />
      ))}
    </div>
  )
}

export { Collections }
