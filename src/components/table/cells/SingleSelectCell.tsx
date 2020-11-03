import React, { useState, useEffect, useRef } from 'react'
import ColourHash from 'color-hash'
import styles from './SingleSelectCell.module.css'

const SingleSelectCell = ({ value }) => {
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

  const colourHash = new ColourHash({hue: {min: 90, max: 270}, lightness: 0.2})

  const selected = value.find((option: any) => option.selected === true)

  return (
    <div onDoubleClick={() => setEdit(true)}>
      {!edit && (
        <div
          className={styles.label}
          style={{ backgroundColor: colourHash.hex(selected.label) }}
        >
          {selected.label}
        </div>
      )}
      {edit && (
        <div>
          {value.map((option: any) => (
            <div
              onClick={() => console.log('change selection')}
              ref={wrapperRef}
              className={styles.label}
              style={{ backgroundColor: colourHash.hex(option.label) }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SingleSelectCell
