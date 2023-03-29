import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import io from "socket.io-client"

function Chatblock(props) {
  const [messageList, setMessageList] = useState([])
  const { chatHistory, setChatHistory } = props
  const { access_token, user_id } = Cookies.get()
  const socket = io('http://localhost:5000', {
    withCredentials: true
  })
  useEffect(() => {
    if (chatHistory.history) {
      setMessageList([])
      const messages = chatHistory.history.data
      console.log(messages)
      messages.slice().reverse().map((message,index)=>{
        setMessageList(prevState => [...prevState, [message.message_type, message.message_body, message.roommate_user_user_id, message.event_timestamp]])
      })
    }
  }, [chatHistory])
  useEffect(() => {
    if (access_token && user_id) {
      socket.emit('join', {
        token: access_token,
        user_id: user_id
      })
    }
    socket.on('message', (message) => {
      if (message === '') { console.log('empty') }
      setMessageList(prevState => [...prevState, [message.messageType, message.message, message.id]])
    })
  }, [])
  const sendMessage = (e) => {
    e.preventDefault()
    const message = e.target.querySelector('input').value;
    e.target.querySelector('input').value = ''
    socket.emit('message', [message, user_id])
  }
  function Message(prop) {
    const messageType = prop.prop[0]
    const message = prop.prop[1]
    const id = prop.prop[2]
    const timestamp = prop.prop[3]
    if (messageType === 'infomessage') {
      return (
        <li className='infomessage'>
          <p>{message}</p>
        </li>)
    } else if (messageType === 'usermessage') {
      if (id === user_id) {
        return (
          <div className='d-flex'>
            <li className='usermessage mymessage rounded'>
              <div>
                <p>@{id}</p>
                <p className='timestampP'>{timestamp}</p>
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
        <h1>Welcome</h1>
        <ul>
          {messageList.slice().reverse().map((message, index) => (
            <Message key={index} prop={message}></Message>
          ))}
        </ul>
        <form className='sendblock input-group'>
          <input type="text" placeholder='Type your message' className="form-control" />
          <button type='submit' className='btn btn-light d-flex'>Send</button>
        </form>
      </div>
    </>
  )
}
export default Chatblock