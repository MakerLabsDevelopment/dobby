import React, { useRef } from 'react'
import { useOutsideAlerter } from '../../../hooks'
import styles from './TextAreaCell.module.css'

const TextAreaCell = ({ value, onChange, onBlur }) => {
  const wrapperRef = useRef(null)
  const [edit, setEdit]: any = useOutsideAlerter(wrapperRef)

  return (
    <div onDoubleClick={() => setEdit('selected')}>
      {!edit && (
        <input
          className={styles.input}
          value={value}
          onChange={onChange}
        />
      )}
      {edit === 'selected' && (
        <textarea
          className={styles.textarea}
          ref={wrapperRef}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    </div>
  )
}

export default TextAreaCell
