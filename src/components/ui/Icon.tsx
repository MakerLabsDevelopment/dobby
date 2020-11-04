import React from 'react'
import clsx from 'clsx'
import { ReactComponent as ArrowDown } from '../../assets/images/arrow-down.svg'

import styles from './Icon.module.css'

const icons = {
  arrowDown: ArrowDown,
}

interface IconProps {
  className?: string
  color?: string
  icon: string
  onClick?: () => any
  size?: string
}

const Icon = ({
  className,
  color,
  icon,
  onClick,
  size
}: IconProps) => {
  const Component = icons[icon]
  return (
    <Component
      className={clsx(
        styles.icon,
        color && styles[color],
        size && styles[size],
        className
      )}
      onClick={onClick}
    />
  )
}

export default Icon
