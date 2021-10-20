import React, { useState } from 'react'
import NavbarLink from './NavbarLink'
import { Link } from 'react-router-dom'

const Navbar = (props) => {
  const [path, setPath] = useState('');
  const onClick = () => {
  }
  return (
    <div id='navbar' className='navbar'>
      <ul>
        <NavbarLink onClick={onClick} path={path} setPath={setPath} >
          <Link to='/'>Home</Link>
        </NavbarLink>
        <NavbarLink onClick={onClick} path={path} setPath={setPath}>
          <Link to='/rooms'>Rooms</Link>
        </NavbarLink>
        <NavbarLink onClick={onClick} path={path} setPath={setPath}>
          <Link to='/about'>About</Link>
        </NavbarLink>
        <NavbarLink onClick={onClick} path={path} setPath={setPath}>
          <Link to='/help'>Help</Link>
        </NavbarLink>
      </ul>
    </div>
  )
}

export default Navbar
