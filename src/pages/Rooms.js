import React from 'react'
import Roomlist from '../components/Roomlist'
const Rooms = (props) => {
  return (
    <div>
      <Roomlist
        nickname={props.nickname}
        setNickname={props.setNickname}
        roomId={props.roomId}
        setRoomId={props.setRoomId}
        setPath={props.setPath}
      ></Roomlist>
    </div>
  )
}

export default Rooms
