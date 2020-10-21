import React from 'react'
import styles from './BasePage.module.css'

interface IBasePage {
  children: any
  hasNav: boolean
}

const BasePage = ({ children, hasNav }: IBasePage) => (
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

BasePage.defaultProps = {
  hasNav: true,
}

export { BasePage }
