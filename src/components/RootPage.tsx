import React from 'react'
import styles from './RootPage.module.css'

interface IRootPage {
  children: any
  hasNav: boolean
}

const RootPage = ({ children, hasNav }: IRootPage) => (
  <div className={styles.page}>
    {hasNav && (
      <div className={styles.header}>
        <a className={styles.logo} href='/'>Dobby</a>
        <div className={styles.user}>
          <div className={styles.avatar} />
          <div className={styles.username}>username</div>
        </div>
      </div>
    )}
    <div className={styles.content}>{children}</div>
  </div>
)

RootPage.defaultProps = {
  hasNav: true,
}

export { RootPage }
