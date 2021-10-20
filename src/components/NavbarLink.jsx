import React, { useState, useEffect } from 'react'

const NavbarLink = (props) => {
  const [active, setActive] = useState(false)
  useEffect(() => {
    if (
      `/${window.location.pathname.split('/')[1]}` ===
      `/${props.children.props.children.toLowerCase()}`
    ) {
      setActive(true)
    } else {
      setActive(false)
    }

  }, [props, active])

  const onClick = () => {
    props.setPath(window.location.pathname)
  }
  return active ? (
    <li className='navbar-active'>{props.children}</li>
  ) : (
    <li onClick={onClick}>{props.children}</li>
  )
}

export default NavbarLink
