import React, { useState } from 'react'
import TextAreaCell from './cells/TextAreaCell'
import SingleSelectCell from './cells/SingleSelectCell'
import styles from './EditableCell.module.css'

interface EditableCellProps {
  value: any,
  row: any,
  column: any,
  updateMyData: (index: string, id: string, value: any) => Promise<void>,
}

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id, type },
  updateMyData,
}: EditableCellProps) => {
  const [value, setValue] = useState(initialValue)

  const onChange = (e: any) => {
    setValue(e.target.value)
  }

  const onSave = () => {
    updateMyData(index, id, value)
  }

  if (type === 'single_line_text') {
    return (
      <input
        className={styles.input}
        type='text'
        value={value}
        onChange={onChange}
        onBlur={onSave}
      />
    )
  }

  if (type === 'long_text') {
    return (
      <TextAreaCell
        value={value}
        onChange={onChange}
        onBlur={onSave}
      />
    )
  }

  if (type === 'attachments') {
    return (
      <div>
        {value.map((file: any) => (
          <div>{file.name}</div>
        ))}
        <div onClick={() => console.log('save file in bucket + store link to it')}>add</div>
      </div>
    )
  }

  if (type === 'checkbox') {
    return (
      <input
        type='checkbox'
        value={value}
        onChange={onChange}
        onBlur={onSave}
      />
    )
  }

  if (type === 'multiselect') {
    return (
      <select value={value} onChange={onChange}>
        <option value="grapefruit">Grapefruit</option>
        <option value="lime">Lime</option>
        <option value="coconut">Coconut</option>
        <option value="mango">Mango</option>
      </select>
    )
  }

  if (type === 'single_select') {
    return (
      <SingleSelectCell
        value={value}
        setValue={setValue}
        onSave={onSave}
      />
    )
  }

  if (type === 'collaborator') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onSave} />)
  }

  if (type === 'date') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onSave} />)
  }

  if (type === 'email') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onSave} />)
  }

  if (type === 'url') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onSave} />)
  }

  if (type === 'number') {
    return (
      <input
        className={styles.input}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onSave}
      />
    )
  }

  if (type === 'currency') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onSave} />)
  }

  if (type === 'percentage') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onSave} />)
  }

  if (type === 'duration') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onSave} />)
  }

  if (type === 'rating') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onSave} />)
  }

  if (type === 'formula') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onSave} />)
  }

  if (type === 'rollup') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onSave} />)
  }

  if (type === 'count') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onSave} />)
  }

  if (type === 'lookup') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onSave} />)
  }

  if (type === 'created_time') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onSave} />)
  }

  if (type === 'last_modified_time') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onSave} />)
  }

  if (type === 'created_by') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onSave} />)
  }

  if (type === 'last_modified_by') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onSave} />)
  }

  if (type === 'autonumber') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onSave} />)
  }

  if (type === 'barcode') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onSave} />)
  }

  if (type === 'button') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onSave} />)
  }

  if (type === 'link_to_another_record') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onSave} />)
  }
}

export default EditableCell
