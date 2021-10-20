/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router'
import TextEditor from '../components/TextEditor'
import { io, Socket } from 'socket.io-client' 


const Document = (props) => {
  const history = useHistory()
  /**@type {[Socket]} */ 
  const [socket, setSocket] = useState()
  const [quills, setQuills] = useState([])
  const document = useRef()
  useEffect(() => {
    const s = io()
    setSocket(s)
    return () => {
      s.disconnect()
    }
  }, [])
  useEffect(() => {
    if (socket === null || socket === undefined) return
    socket.on('connect', (id) => {
      socket.emit('userConnect', props.nickname)
    })

    socket.once('selfJoinedRoom', () => {
      quills.forEach((q) => {
        console.log(q)
        socket.emit('get-document-field', q.id)
      })
    })
    socket.once('room-not-found', () => {
      history.push('/rooms')
    })
  }, [socket,quills])

  useEffect(() => {
    if (socket === null || socket === undefined) return
    socket.on('joinedRoom', (sIds) => {
      var newArray = [{ id: 'title' }]
      sIds.forEach((sId) => {
        newArray.push({ id: sId })
      })
      console.log("Test")
      setQuills(newArray)
    })
  },[socket])

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
