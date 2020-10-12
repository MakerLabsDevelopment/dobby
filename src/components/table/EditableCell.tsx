import React from 'react'

type EditabeCellProps = {
  value: any,
  row: any,
  column: any,
  updateMyData: any
}

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData,
}: EditabeCellProps) => {
  const [value, setValue] = React.useState(initialValue)

  const onChange = (e: any) => {
    setValue(e.target.value)
  }

  const onBlur = () => {
    updateMyData(index, id, value)
  }

  return (<input value={value} onChange={onChange} onBlur={onBlur} />)
}

export default EditableCell
