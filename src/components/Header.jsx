import React from 'react'
import '../css/Header.css'
import list from '../img/list.svg'

const Header = () => {
  return (
    <div id='header' className='header'>
      <img id='header-list' className='header-list' src={list} alt='list' />
      <div id='header-title' className='header-title'>
        Shared Notes (Alpha)
      </div>
    </div>
  )
}

export default Header
