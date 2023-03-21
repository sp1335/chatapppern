import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import io from "socket.io-client"

function Chatblock() {
  const [messageList, setMessageList] = useState([])
  const cookie = Cookies.get()
  const socketID = cookie.socketID
  const socket = io('http://localhost:8080', {
    withCredentials: true
  })
  useEffect(() => {
    if (socketID) {
      socket.emit('existing', socketID)
    } else {
      socket.emit('login')
      socket.on('socketID', (arg) => {
        document.cookie = `socketID=${arg}`
      })
    }
    socket.on('message', (message) => {
      setMessageList(prevState => [...prevState, [message.messageType, message.message, message.id]])
    })
  }, [])
  const sendMessage = (e) => {
    e.preventDefault()
    const message = e.target.querySelector('input').value;
    e.target.querySelector('input').value = ''
    socket.emit('message', [message, cookie.socketID])
  }
  function Message(prop) {
    const messageType = prop.prop[0]
    const message = prop.prop[1]
    const id = prop.prop[2]
    if (messageType === 'infomessage') {
      return (
        <li className='infomessage'>
          <p>{message}</p>
        </li>)
    } else if (messageType === 'usermessage') {
      if (id === cookie.socketID) {
        return (
          <div className='d-flex'>
            <li className='usermessage mymessage rounded'>
              <div>
                <p>@{id}</p>
                <p className='timestampP'>12:55</p>
              </div>
              <p className='messageP'>{message}</p>
            </li>
          </div>
        )
      } else {
        return (
          <div className='d-flex'>
            <li className='usermessage rounded'>
              <div>
                <p >@{id}</p>
                <p className='timestampP'>12:55</p>
              </div>
              <p className='messageP'>{message}</p>
            </li>
          </div>
        )
      }
    }
  }
  return (
    <>
      <div className='chatbody'>
        <h1>#roomname</h1>
        <ul>
          {messageList.slice().reverse().map((message, index) => (
            <Message key={index} prop={message}></Message>
          ))}
        </ul>
        <form onSubmit={sendMessage} className='sendblock input-group'>
          <input type="text" placeholder='Type your message' className="form-control" />
          <button type='submit' className='btn btn-light d-flex'>Send</button>
        </form>
      </div>
    </>
  )
}
export default Chatblock