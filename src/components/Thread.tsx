import React from 'react'
import ColourHash from 'color-hash'
import styles from './Thread.module.css'

const Thread = ({ thread: { id, name } }: any) => {
  const colourHash = new ColourHash()
  const threadName = name || 'No name'
  const backgroundColourStyle = {
    backgroundColor: colourHash.hex(threadName.substring(0, 2)),
  }
  return (
    <a className={styles.thread} href={`/threads/${id}`}>
      <p style={backgroundColourStyle} className={styles.threadIcon}>
        {name.substring(0, 2)}
      </p>
      <p className={styles.threadName}>{threadName}</p>
    </a>
  )
}

export { Thread }
