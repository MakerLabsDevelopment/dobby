import React, { useState, useEffect, useRef } from 'react'
import styles from './TextAreaCell.module.css'

const TextAreaCell = ({ value, onChange, onBlur }) => {
  const [edit, setEdit] = useState(false)

  const useOutsideAlerter = (ref: any) => {
    useEffect(() => {
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          setEdit(false)
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref])
  }
  const wrapperRef = useRef(null)
  useOutsideAlerter(wrapperRef)

  return (
    <div onDoubleClick={() => setEdit(true)}>
      {!edit && (
        <input
          value={value}
          onChange={onChange}
        />
      )}
      {edit && (
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
