import React, { useState } from 'react'

interface EditableCellProps {
  value: any,
  row: any,
  column: any,
}

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id, type },
}: EditableCellProps) => {
  // console.log(type, 'type')
  const [value, setValue] = useState(initialValue)

  const updateMyData = (index, id, value) => console.log("updating")

  const onChange = (e: any) => {
    setValue(e.target.value)
  }

  const onBlur = () => {
    updateMyData(index, id, value)
  }

  if (type === 'single_line_text') {
    return (<input type='text' value={value} onChange={onChange} onBlur={onBlur} />)
  }

  if (type === 'long_text') {
    return (<textarea value={value} onChange={onChange} onBlur={onBlur} />)
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
    return (<input type='checkbox' value={value} onChange={onChange} onBlur={onBlur} />)
  }

  if (type === 'multiselect') {
    return (
      <select value={[]} onChange={onChange}>
        <option value="grapefruit">Grapefruit</option>
        <option value="lime">Lime</option>
        <option value="coconut">Coconut</option>
        <option value="mango">Mango</option>
      </select>
    )
  }

  if (type === 'single_select') {
    return (
      <select value={value} onChange={onChange}>
        <option value="grapefruit">Grapefruit</option>
        <option value="lime">Lime</option>
        <option value="coconut">Coconut</option>
        <option value="mango">Mango</option>
      </select>
    )
  }

  if (type === 'collaborator') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onBlur} />)
  }

  if (type === 'date') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onBlur} />)
  }

  if (type === 'email') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onBlur} />)
  }

  if (type === 'url') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onBlur} />)
  }

  if (type === 'number') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onBlur} />)
  }

  if (type === 'currency') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onBlur} />)
  }

  if (type === 'percentage') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onBlur} />)
  }

  if (type === 'duration') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onBlur} />)
  }

  if (type === 'rating') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onBlur} />)
  }

  if (type === 'formula') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onBlur} />)
  }

  if (type === 'rollup') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onBlur} />)
  }

  if (type === 'count') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onBlur} />)
  }

  if (type === 'lookup') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onBlur} />)
  }

  if (type === 'created_time') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onBlur} />)
  }

  if (type === 'last_modified_time') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onBlur} />)
  }

  if (type === 'created_by') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onBlur} />)
  }

  if (type === 'last_modified_by') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onBlur} />)
  }

  if (type === 'autonumber') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onBlur} />)
  }

  if (type === 'barcode') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onBlur} />)
  }

  if (type === 'button') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onBlur} />)
  }

  if (type === 'link_to_another_record') {
    return (<input type={type} value={value} onChange={onChange} onBlur={onBlur} />)
  }
}

export default EditableCell
