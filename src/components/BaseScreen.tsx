import React from 'react'
import './BaseScreen.css'

interface IBaseScreen {
  children: any
  hasNav: boolean
}

const BaseScreen = ({ children, hasNav }: IBaseScreen) => (
  <div className='screen'>
    {hasNav && (
      <div className='header'>
        <a className='avatar' href='/'>Dobby</a>
      </div>
    )}
    <div className='content'>
      {children}
    </div>
  </div>
)

BaseScreen.defaultProps = {
  hasNav: true
}

export default BaseScreen
