import React from 'react'
import ColourHash from 'color-hash'
import styles from './Base.module.css'
import type { Base as ModelBase } from '../model'

const Base = ({ base }: { base: ModelBase }) => {
  const colourHash = new ColourHash()
  const baseName = base.name || 'No name'
  const backgroundColourStyle = {
    backgroundColor: colourHash.hex(baseName.substring(0, 2)),
  }
  return (
    <a className={styles.base} href={`/bases/${base.id.value}`}>
      <p style={backgroundColourStyle} className={styles.baseIcon}>
        {base.name.substring(0, 2)}
      </p>
      <p className={styles.baseName}>{baseName}</p>
    </a>
  )
}

export { Base }
