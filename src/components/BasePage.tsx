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
        <a className={styles.avatar} href="/">
          Dobby
        </a>
      </div>
    )}
    <div className={styles.content}>{children}</div>
  </div>
)

BasePage.defaultProps = {
  hasNav: true,
}

export { BasePage }
