import React from 'react'
import { useRecoilValue } from 'recoil'
import { Base } from './Base'
import { basesSelector } from '../state'
import styles from './Bases.module.css'

const Bases = () => {
  const bases = useRecoilValue(basesSelector)
  return (
    <div className={styles.bases}>
      {bases?.map((base) => (
        <Base key={base.id.value} base={base} />
      ))}
    </div>
  )
}

export { Bases }
