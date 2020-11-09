import { useState, useEffect } from 'react'

export const useOutsideAlerter = (ref) => {
  const [edit, setEdit] = useState(null)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setEdit(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref])
  return [edit, setEdit]
}
