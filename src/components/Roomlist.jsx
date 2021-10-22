import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router'
import Loader from 'react-loader-spinner'

// css
import '../css/Roomlist.css'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

// img
import refreshIcon from '../img/refresh.svg'
import createroomIcon from '../img/createroom.svg'
import joinroomIcon from '../img/joinroom.svg'
import playIcon from '../img/play.svg'
import cancelIcon from '../img/cancel.svg'

const Roomlist = (props) => {
  const history = useHistory()

  // States
  const [roomlistLoading, setLoading] = useState(false)
  const [name, setName] = useState(
    props.nickname +
      (props.nickname[props.nickname.length - 1] === 's' ? '' : `'s`) +
      ` Lobby`
  )
  const [password, setPassword] = useState('')
  const [users, setUsers] = useState(16)
  const [tableContent, setTableContent] = useState([])
  const [activeRow, setActiveRow] = useState('')

  // Refs
  const roomlist = useRef()
  const roomlistTBody = useRef()
  const roomlistCounter = useRef()
  const loadSpinner = useRef()
  const roomCreate = useRef()
  const roomJoin = useRef()

  // Funcs
  const onClickRow = (e) => {
    setActiveRow(e.target.parentElement.id)
    console.log(e.target.parentElement.id)
  }
  const renderRow = (el) => {
    return (
      <tr
        id={el.id}
        key={el.id}
        onClick={(e) => onClickRow(e)}
        style={{ backgroundColor: activeRow === el.id ? '#CCC' : '' }}
      >
        <td>{el.name}</td>
        <td>{el.users} / {el.maxusers}</td>
        <td>{el.password}</td>
        <td>{el.owner}</td>
      </tr>
    )
  }
  const getUserCount = () => {
    var count = 0
    tableContent.map((el) => {
      count += el.users
    })
    return count
  }
  const onRefresh = () => {
    setLoading(true)
    fetch('/rooms/').then((result) =>
      result.json().then((data) => {
        setTimeout(() => {
          setTableContent(data)
          setLoading(false)
        }, 300)
      })
    )
  }
  const onJoin = () => {
    if (activeRow !== '') {
      roomlist.current.style.display = 'none'
      roomJoin.current.style.display = 'block'
    }
  }
  const onCreate = () => {
    roomlist.current.style.display = 'none'
    roomCreate.current.style.display = 'block'
  }
  const onCancelCreate = () => {
    roomlist.current.style.display = 'block'
    roomCreate.current.style.display = 'none'
    onRefresh()
  }
  const onCancelJoin = () => {
    roomlist.current.style.display = 'block'
    roomJoin.current.style.display = 'none'
    setActiveRow('')
    onRefresh()
  }
  const onCreateRoom = () => {
    let data = {
      owner: props.nickname,
      name: name,
      maxusers: users,
      password: password,
    }
    fetch('/rooms/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((result) => {
      result.json().then((data) => {
        props.setRoomId(data.redirectUrl.split('/')[2])
        history.push(data.redirectUrl)
      })
    })
  }
  const onJoinRoom = () => {
    let data = {
      password: password,
      roomId: activeRow,
    }
    fetch('/rooms/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((result) => {
      result.json().then((data) => {
        if (data.success) history.push(data.redirectUrl)
      })
    })
  }

  // Use Effect
  useEffect(() => {
    if (!roomlistTBody) return
    if (roomlistLoading) {
      roomlistCounter.current.innerHTML = ''
      roomlistTBody.current.style.visibility = 'hidden'
      loadSpinner.current.style.visibility = 'visible'
    } else {
      roomlistTBody.current.style.visibility = 'visible'
      loadSpinner.current.style.visibility = 'hidden'
    }
  }, [roomlistLoading])
  useEffect(() => {
    onRefresh()
  }, [])

  // Render
  return (
    <>
      <div id='roomlist' className='roomlist' ref={roomlist}>
        <div id='roomlist-title' className='roomlist-title'>
          Room list
        </div>
        <div
          id='roomlist-counter'
          className='roomlist-counter'
          ref={roomlistCounter}
        >
          100 users in 10 rooms
        </div>
        <div id='roomlist-line' className='roomlist-line'></div>
        <div id='loadSpinner' ref={loadSpinner}>
          <Loader type='TailSpin' color='#be1e3c' height={40} width={40} />
        </div>
        <table id='roomlist-table' className='roomlist-table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Users</th>
              <th>Password</th>
              <th>Owner</th>
            </tr>
          </thead>
          <tbody ref={roomlistTBody}>
            {tableContent.map(renderRow)}
            <tr><td colSpan={4} style={{textAlign: 'center', color:'#777', width: 500}}>{getUserCount()} user(s) found in {tableContent.length} room(s)</td></tr>
          </tbody>
        </table>
        <div
          className='roomlist-button'
          id='roomlist-refresh'
          onClick={onRefresh}
        >
          <img
            className='roomlist-button-icon'
            src={refreshIcon}
            alt='refresh'
          />
          <div className='roomlist-button-text'>Refresh</div>
        </div>
        <div className='roomlist-button' id='roomlist-join' onClick={onJoin}>
          <img className='roomlist-button-icon' src={joinroomIcon} alt='join' />
          <div className='roomlist-button-text'>Join</div>
        </div>
        <div
          className='roomlist-button'
          id='roomlist-create'
          onClick={onCreate}
        >
          <img
            className='roomlist-button-icon'
            src={createroomIcon}
            alt='create'
          />
          <div className='roomlist-button-text'>Create</div>
        </div>
      </div>
      <div className='room-create' style={{ display: 'none' }} ref={roomCreate}>
        <div className='room-create-title' id='room-create-title'>
          Create room
        </div>
        <div className='room-create-line' id='room-create-line'></div>
        <div className='room-create-field' id='room-create-field-nickname'>
          <div className='room-create-field-text'>Nickname</div>
          <input
            className='room-create-field-input'
            value={props.nickname}
            onChange={(e) => props.setNickname(e.target.value)}
          ></input>
        </div>
        <div className='room-create-field' id='room-create-field-name'>
          <div className='room-create-field-text'>Room name</div>
          <input
            className='room-create-field-input'
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div className='room-create-field' id='room-create-field-password'>
          <div className='room-create-field-text'>Password</div>
          <input
            className='room-create-field-input'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div className='room-create-field' id='room-create-field-users'>
          <div className='room-create-field-text'>Max-Users</div>
          <input
            className='room-create-field-input'
            value={users}
            onChange={(e) => setUsers(e.target.value)}
            type='number'
            min='4'
            max='20'
          ></input>
        </div>
        <div
          className='room-create-button'
          id='room-create-button-cancel'
          onClick={onCancelCreate}
        >
          <img
            className='room-create-button-icon'
            src={cancelIcon}
            alt='cancel'
          />
          <div className='room-create-button-text'>Cancel</div>
        </div>
        <div
          className='room-create-button'
          id='room-create-button-play'
          onClick={onCreateRoom}
        >
          <img className='room-create-button-icon' src={playIcon} alt='play' />
          <div className='room-create-button-text'>Create</div>
        </div>
      </div>
      <div
        className='room-create'
        id='room-join'
        style={{ display: 'none' }}
        ref={roomJoin}
      >
        <div className='room-create-title' id='room-create-title'>
          Join room
        </div>
        <div className='room-create-line' id='room-create-line'></div>
        <div className='room-create-field' id='room-create-field-nickname'>
          <div className='room-create-field-text'>Nickname</div>
          <input
            className='room-create-field-input'
            value={props.nickname}
            onChange={(e) => props.setNickname(e.target.value)}
          ></input>
        </div>
        <div className='room-create-field' id='room-join-field-password'>
          <div className='room-create-field-text'>Password</div>
          <input
            className='room-create-field-input'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div
          className='room-create-button'
          id='room-join-button-cancel'
          onClick={onCancelJoin}
        >
          <img
            className='room-create-button-icon'
            src={cancelIcon}
            alt='cancel'
          />
          <div className='room-create-button-text'>Cancel</div>
        </div>
        <div
          className='room-create-button'
          id='room-join-button-play'
          onClick={onJoinRoom}
        >
          <img className='room-create-button-icon' src={playIcon} alt='play' />
          <div className='room-create-button-text'>Join</div>
        </div>
      </div>
    </>
  )
}

export default Roomlist
