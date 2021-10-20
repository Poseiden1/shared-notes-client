import React, { useState } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Cookies from 'js-cookie'

// Components
import Navbar from '../components/Navbar'

// Pages
import Home from '../pages/Home'
import About from '../pages/About'
import Rooms from '../pages/Rooms'
import Help from '../pages/Help'
import Document from '../pages/Document'

// CSS
import '../css/Navbar.css'
import '../css/Main.css'

const Container = (props) => {
  const [nickname, setNickname] = useState(Cookies.get('nickname') === undefined ? 'Unknown' : Cookies.get('nickname'))
  const [roomId, setRoomId] = useState('')
  return (
    <div id='container'>
      <Navbar></Navbar>
      <div id='main' className='main'>
        <Switch>
          <Route exact path='/home'>
            <Home></Home>
          </Route>
          <Route exact path='/rooms'>
            <Rooms nickname={nickname} setNickname={setNickname} roomId = {roomId} setRoomId = {setRoomId}></Rooms>
          </Route>
          <Route exact path='/about'>
            <About></About>
          </Route>
          <Route exact path='/help'>
            <Help></Help>
          </Route>
          <Route path='/rooms/:id'>
            <Document nickname={nickname}></Document>
          </Route>
          <Redirect exact from='/' to='home' />
          <Redirect from='/' to='404' />
        </Switch>
      </div>

      {props.children}
    </div>
  )
}

export default Container
