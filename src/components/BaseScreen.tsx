import React from 'react'
import styles from './BaseScreen.module.css'

interface BaseScreenProps {
  children: any
  hasNav: boolean
}

const BaseScreen = ({ children, hasNav }: BaseScreenProps) => (
  <div className={styles.screen}>
    {hasNav && (
      <div className={styles.header}>
        <a className={styles.logo} href='/'>Dobby</a>
        <div className={styles.user}>
          <div className={styles.avatar} />
          <div className={styles.username}>username</div>
        </div>
      </div>
    )}
    <div className={styles.content}>
      {children}
    </div>
  </div>
)

BaseScreen.defaultProps = {
  hasNav: true
}

export default BaseScreen
