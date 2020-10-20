import React, { useEffect, useRef } from 'react'
import styles from './RowOptionsMenu.module.css'

interface ColumnOptionsMenuProps {
  onClose: () => any
  rowId: any,
  xPos: any,
  yPos: any
}

const ColumnOptionsMenu = ({
  onClose,
  rowId,
  xPos,
  yPos
}: ColumnOptionsMenuProps) => {

  const useOutsideAlerter = (ref: any) => {
    useEffect(() => {
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          onClose()
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

  const removeRow = async (instanceId: string) => {
    // doCollectionsDeleteRow(name, instanceId)
  }

  return (
    <div
      className={styles.menu}
      style={{ top: yPos, left: xPos }}
      ref={wrapperRef}
    >
      <div className={styles.menuItem} onClick={() => removeRow(rowId)}>delete row</div>
    </div>
  )
}

export default ColumnOptionsMenu
