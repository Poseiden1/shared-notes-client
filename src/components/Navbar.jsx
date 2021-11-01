import React, { useState, useEffect } from 'react'
import NavbarLink from './NavbarLink'
import { Link } from 'react-router-dom'

const Navbar = (props) => {
  const [isDocumentHidden, setIsDocumentHidden] = useState(true)

  useEffect(() => {
    let l = props.path.split('/')

    if (l.length === 3) {
      if (l[1] === 'rooms' && l[2].length === 8) {
        setIsDocumentHidden(false)
      } else {
        setIsDocumentHidden(true)
      }
    } else {
      setIsDocumentHidden(true)
    }
  }, [props])
  return (
    <div id='navbar' className='navbar'>
      <ul>
        <NavbarLink path={props.path} setPath={props.setPath}>
          <Link to='/'>Home</Link>
        </NavbarLink>
        <NavbarLink path={props.path} setPath={props.setPath}>
          <Link to='/rooms'>Rooms</Link>
        </NavbarLink>
        <NavbarLink path={props.path} setPath={props.setPath}>
          <Link to='/about'>About</Link>
        </NavbarLink>
        <NavbarLink path={props.path} setPath={props.setPath}>
          <Link to='/help'>Help</Link>
        </NavbarLink>
        <NavbarLink path={props.path} hidden={isDocumentHidden}>
          <div>Download as PDF</div>
        </NavbarLink>
      </ul>
    </div>
  )
}

export default Navbar
