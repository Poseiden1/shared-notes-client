/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router'
import TextEditor from '../components/TextEditor'
import { io, Socket } from 'socket.io-client'
import Cookies from 'js-cookie'

const Document = (props) => {
  const history = useHistory()
  /**@type {[Socket]} */
  const [socket, setSocket] = useState()
  const [quills, setQuills] = useState([])
  const document = useRef()
  useEffect(() => {
    if (Cookies.get('nickname') === 'Unknown' || !Cookies.get('nickname')) {
      history.push('/rooms')
      return
    }
    const s = io()
    setSocket(s)
    return () => {
      s.disconnect()
    }
  }, [])
  useEffect(() => {
    if (socket === null || socket === undefined) return
    const handler = () => {
      socket.emit('userConnect', props.nickname)
    }
    socket.on('connect', handler)

    return () => {
      socket.off('connect', handler)
    }
  }, [socket, quills])

  useEffect(() => {
    if (socket === null || socket === undefined) return
    const handler = () => {
      quills.forEach((q) => {
        socket.emit('get-document-field', q.id)
      })
    }
    socket.once('selfJoinedRoom', handler)

    return () => {
      socket.off('selfJoinedRoom', handler)
    }
  }, [socket, quills])

  useEffect(() => {
    if (socket === null || socket === undefined) return
    const handler = () => {
      socket.once('room-not-found', () => {
        history.push('/rooms')
      })
    }

    socket.once('room-not-found', handler)
    return () => {
      socket.off('room-not-found', handler)
    }
  }, [socket])

  useEffect(() => {
    if (socket === null || socket === undefined) return
    const handler = (users) => {
      var newArray = [{ id: 'title' }]
      users.forEach((user) => {
        newArray.push({ id: user.id, nickname: user.nickname })
      })
      setQuills(newArray)
    }
    socket.on('joinedRoom', handler)

    return () => {
      socket.off('joinedRoom', handler)
    }
  }, [socket])

  return (
    <div id='document' ref={document}>
      {quills.map((q) => (
        <TextEditor
          socket={socket}
          setSocket={setSocket}
          key={q.id}
          id={q.id}
        ></TextEditor>
      ))}
    </div>
  )
}

export default Document
