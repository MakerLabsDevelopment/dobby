import React, { useEffect, useRef } from 'react'
import clsx from 'clsx'
import { useOutsideAlerter } from '../../../hooks'
import styles from './UrlCell.module.css'

const UrlCell = ({ value, onChange, onSave }) => {
  const wrapperRef = useRef(null)
  const [edit, setEdit]: any = useOutsideAlerter(wrapperRef)

  useEffect(() => {
    if (!value) {
      setEdit('dropdown')
    }
  }, [])

  const onBlur = () => {
    onSave()
    setEdit(null)
  }

  return (
    <div className={styles.container}>
      {!edit && (
        <div
          className={clsx(styles.input, styles.inactive)}
          onClick={() => setEdit('selected')}
        >
          {value}
        </div>
      )}
      {edit === 'selected' && (
        <div
          onDoubleClick={() => setEdit('dropdown')}
          className={clsx(styles.input, styles.active)}
        >
          <a href={value}>{value}</a>
        </div>
      )}
      {edit === 'dropdown' && (
        <input
          className={styles.input}
          type='url'
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    </div>
  )
}

export default UrlCell
