/* eslint-disable no-unused-vars */
import React from 'react'
import { useEffect, useCallback, useState } from 'react'
import Quill from 'quill'
import '../css/TextEditor.css'
import ImageCompress from 'quill-image-compress'
Quill.register('modules/imageCompress', ImageCompress)

var toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],
  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ header: [1, 2, 3, false] }], // Header
  ['image'], // Image
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  ['clean'], // remove formatting button
]

export default function TextEditor(props) {
  /** @type {[Quill]} */
  const [quill, setQuill] = useState()
  const [name, setName] = useState()
  const [typing, setTyping] = useState(false)
  const [timer, setTimer] = useState(undefined)
  useEffect(() => {
    const n = 'Unknown'
    setName(n)
  }, [])

  useEffect(() => {
    if (props.socket == null || quill == null) return

    const handler = (delta, name, id) => {
      if (id === props.id) {
        quill.updateContents(delta)
        if (id === props.socket.id) {
          quill.focus()
          quill.setSelection(quill.getLength() - 1, 1)
          quill.container.previousSibling.style.display = 'block'
        }
      }
    }
    props.socket.on('receive-changes-' + props.id, handler)

    return () => {
      props.socket.off('receive-changes-' + props.id, handler)
    }
  }, [props, quill])

  useEffect(() => {
    if (props.socket == null || quill == null) return
    const timeoutFunction = () => {
      if (quill == null) return
      setTyping(false)
      setTimer(setTimeout(timeoutFunction, 10000))
      let id = quill.container.parentElement.id
      props.socket.emit('save-document-field', quill.getContents(), id)
    }

    const handler = (delta, oldDelta, source) => {
      if (source !== 'user') return
      let id = quill.container.parentElement.id
      props.socket.emit('send-changes', delta, name, id)
      // is Typing ... stuff
      if (!typing) {
        setTyping(true)
        setTimer(setTimeout(timeoutFunction, 3000))
      } else {
        clearTimeout(timer)
        setTimer(setTimeout(timeoutFunction, 3000))
      }
    }
    quill.on('text-change', handler)

    return () => {
      clearTimeout(timer)
      quill.off('text-change', handler)
    }
  }, [name, props.socket, quill, typing, timer])

  useEffect(() => {
    if (props.socket == null || quill == null) return
    const handler = (range, oldRange, source) => {
      if (range) {
        // quill.container.previousSibling.style.display = 'block'
        if (range.length === 0) {
          console.log('User cursor is on', range.index)
        } else {
          var text = quill.getText(range.index, range.length)
          console.log('User has highlighted', text)
        }
      } else {
        // quill.container.previousSibling.style.display = 'none'
        console.log('Cursor not in the editor')
      }
    }
    quill.on('selection-change', handler)
    return () => {
      quill.off('selection-change', handler)
    }
  }, [name, props.socket, quill])

  useEffect(() => {
    if (props.socket == null || quill == null) return

    const handler = (data, id) => {
      console.log('DOWNLOADED   ' + id)
      if (id === props.id) {
        quill.setContents(data)
        if (id === props.socket.id) {
          quill.enable()
          quill.focus()
          quill.setSelection(quill.getLength() - 1, 1)
          quill.container.previousSibling.style.display = 'block'
        }
      }
    }

    props.socket.on('load-document-field-' + props.id, handler)
    return () => {
      props.socket.off('load-document-field-' + props.id, handler)
    }
  }, [props, quill])

  useEffect(() => {
    if (props.socket == null || quill == null) return

    const handler = (id) => {
      if (id === props.id) {
        var data = quill.getContents()
        props.socket.emit('load-document-field', data, id)
      }
    }

    props.socket.on('get-document-field-' + props.id, handler)

    return () => {
      props.socket.off('get-document-field-' + props.id, handler)
    }
  }, [props.socket, quill]) // eslint-disable-line react-hooks/exhaustive-deps

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return
    wrapper.innerHTML = ''
    const editor = document.createElement('div')
    wrapper.append(editor)
    const q = new Quill(editor, {
      theme: 'snow',
      modules: {
        toolbar: toolbarOptions,
        imageCompress: {
          quality: 0.3, // default
          maxWidth: 400, // default
          maxHeight: 400, // default
          imageType: 'image/jpeg', // default
          debug: true, // default
          suppressErrorLogging: false, // default
        },
      },
    })
    q.container.previousSibling.style.display = 'none'
    setQuill(q)
    q.disable()
    q.setText('')
    q.root.setAttribute('spellcheck', false)
    if (props.id === 'title') {
      // q.focus()
      // q.container.previousSibling.style.display = 'block'
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return <div id={props.id} ref={wrapperRef}></div>
}
