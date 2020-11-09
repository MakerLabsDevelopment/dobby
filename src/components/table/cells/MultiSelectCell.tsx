import React, { useRef, useState } from 'react'
import { useOutsideAlerter } from '../../../hooks'
import ColourHash from 'color-hash'
import Icon from '../../ui/Icon'
import styles from './MultiSelectCell.module.css'

const MultiSelectCell = ({ value, setValue, onSave }) => {
  const wrapperRef = useRef(null)
  const [edit, setEdit]: any = useOutsideAlerter(wrapperRef)
  const [searchValue, setSearchValue] = useState<string>('')

  const colourHash = new ColourHash({hue: {min: 90, max: 150}, lightness: 0.8})

  const selected = value.filter((option: any) => option.selected === true)

  const selectCell = () => {
    if (!edit) {
      setEdit('selected')
    } else if (edit === 'selected') {
      setEdit('dropdown')
    } else {
      setEdit(null)
    }
  }

  const onSearch = (e: any) => {
    setSearchValue(e.target.value)
  }

  const filteredOptionsList = value.filter(
    (option: any) => option.label.includes(searchValue)
  )

  const selectOption = (label: string) => {
    value.find((option: any) => option.label === label).selected = true
    setValue(value)
    onSave()
    setEdit(null)
  }

  const addOption = () => {
    const newOption = { label: searchValue, selected: true }
    value.push(newOption)
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
        {selected.map((option: any, index: number) => (
          <div
            key={index}
            className={styles.label}
            style={{ backgroundColor: colourHash.hex(option.label) }}
          >
            {option.label}
          </div>
        ))}
        {!selected.length && (<div>add</div>)}
        {edit && (<Icon icon="arrowDown" className={styles.arrow}/>)}
      </div>
      {edit === 'dropdown' && (
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
          {filteredOptionsList.map((option: any, index: number) => (
            <div
              key={index}
              onClick={() => selectOption(option.label)}
              className={styles.label}
              style={{ backgroundColor: colourHash.hex(option.label) }}
            >
              {option.label}
            </div>
          ))}
          {searchValue && (<div onClick={addOption}>+ add new option</div>)}
        </div>
      )}
    </div>
  )
}

export default MultiSelectCell
