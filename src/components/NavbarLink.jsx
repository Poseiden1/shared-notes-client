import React, { useState, useEffect } from 'react'

const NavbarLink = (props) => {
  const [active, setActive] = useState(false)
  function printDiv() {
    var w = window.open()
    var printContents = document.getElementById('document').innerHTML
    var doc = document.getElementById('document').children
    for (var i = 0; i < doc.length; i++) {
      w.document.write(doc[i].lastChild.innerHTML)
    }
    w.document.write(
      '<style>.ql-tooltip.ql-hidden { display: none; } .ql-clipboard { display: none; } .ql-toolbar.ql-snow { display: none; }</style>'
    )
    setTimeout(() => {
      w.print()
      w.close()
    }, 100)
  }
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
    if (props.setPath) {
      console.log(props.children)
      console.log(window.location.pathname)
      props.setPath(window.location.pathname)
    } else {
      let l = window.location.pathname.split('/')
      if (l.length === 3) {
        if (l[1] === 'rooms' && l[2].length === 8) {
          printDiv()
        }
      }
    }
  }
  return active ? (
    <li className='navbar-active'>{props.children.props.children}</li>
  ) : (
    <li onClick={onClick} style={{display: props.hidden ? 'none': 'block'}}>{props.children}</li>
  )
}

export default NavbarLink
