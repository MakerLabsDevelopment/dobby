import React, { useRef, useState } from 'react'
import { useOutsideAlerter } from '../../../hooks'
import ColourHash from 'color-hash'
import Icon from '../../ui/Icon'
import styles from './SingleSelectCell.module.css'

const SingleSelectCell = ({ value, setValue, onSave }) => {
  const wrapperRef = useRef(null)
  const [edit, setEdit]: any = useOutsideAlerter(wrapperRef)
  const [select, setSelect] = useState(false)
  const [searchValue, setSearchValue] = useState<string>('')

  const colourHash = new ColourHash({hue: {min: 90, max: 150}, lightness: 0.8})

  const selected = value.options[value.selectedIndex]

  const selectCell = () => {
    if (!select) {
      setSelect(true)
    } else if (select && !edit) {
      setEdit(true)
    } else {
      setEdit(false)
    }
  }

  const onSearch = (e: any) => {
    setSearchValue(e.target.value)
  }

  const filteredOptionsList = value.options.filter(
    (option: any) => option.includes(searchValue)
  )

  const selectOption = (index: number) => {
    value.selectedIndex = index
    setValue(value)
    onSave()
    setEdit(false)
    setSelect(false)
  }

  const addOption = () => {
    value.options.push(searchValue)
    value.selectedIndex = value.options.length - 1
    setValue(value)
    onSave()
    setSearchValue('')
  }

  return (
    <div>
      <div
        className={styles.container}
        onClick={selectCell}
      >
        <div
          className={styles.label}
          style={{ backgroundColor: colourHash.hex(selected) }}
        >
          {selected}
        </div>
        {select && (<Icon icon="arrowDown" className={styles.arrow}/>)}
      </div>
      {edit && (
        <div
          className={styles.dropdownContainer}
          ref={wrapperRef}
        >
          <input
            type="text"
            placeholder="find an option"
            value={searchValue}
            onChange={onSearch}
          />
          {filteredOptionsList.map((option: string, index: number) => (
            <div
              key={index}
              onClick={() => selectOption(index)}
              className={styles.label}
              style={{ backgroundColor: colourHash.hex(option) }}
            >
              {option}
            </div>
          ))}
          {searchValue && (<div onClick={addOption}>+ add new option</div>)}
        </div>
      )}
    </div>
  )
}

export default SingleSelectCell
