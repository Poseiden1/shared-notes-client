import React from 'react'
import '../css/Header.css'
import list from '../img/list.svg'

const Header = () => {
  function printDiv() {
    var w = window.open()
    var printContents = document.getElementById('document').innerHTML
    w.document.write('<style>.ql-tooltip.ql-hidden { display: none; } .ql-clipboard { display: none; } </style>')
    w.document.write(printContents)
    setTimeout(() => {
      w.print()
      w.close()
    }, 100)
    
  }
  return (
    <div id='header' className='header'>
      <img id='header-list' className='header-list' src={list} alt='list' />
      <div id='header-title' className='header-title'>
        Shared Notes (Alpha)
      </div>
      <div id='header-download' className='header-download' onClick={printDiv}>
        Download as PDF
      </div>
    </div>
  )
}

export default Header
