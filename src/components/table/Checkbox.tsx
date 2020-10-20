// @ts-nocheck
import React, { forwardRef, useEffect, useRef } from 'react'

interface IndeterminateCheckboxProps {
  indeterminate: any
}
interface RefProps {}

export const IndeterminateCheckbox = forwardRef<RefProps, IndeterminateCheckboxProps>(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = useRef()
    const resolvedRef = ref || defaultRef

    useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    )
  }
)
