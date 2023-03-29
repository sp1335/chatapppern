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
      if (chatHistory.history.data) {
        setMessageList([])
        const messages = chatHistory.history.data
        messages.slice().reverse().map((message, index) => {
          setMessageList(prevState => [...prevState, [message.message_type, message.message_body, message.roommate_user_user_id, message.event_timestamp]])
        })
      } else {
        setMessageList([['infomessage', 'No messages yet...']])
      }
      console.log(chatHistory)
    }
  }, [chatHistory])
  useEffect(() => {
    if (access_token && user_id) {
      socket.emit('join', {
        token: access_token,
        user_id: user_id
      })
    }
    socket.on('newMessage', (message) => {
      console.log(message)
      if (message === '') { console.log('empty') }
      console.log(message)
      setMessageList(prevState => [...prevState, [message.messageType, message.message, message.id, message.timestamp]])
    })
  }, [])
  const sendMessage = (e) => {
    e.preventDefault()
    const messagetext = e.target.querySelector('input').value;
    if (messagetext !== '') {
      e.target.querySelector('input').value = ''
      socket.emit('message', { message: messagetext, "user_id": user_id, token: access_token, chat_id: chatHistory.history.chat_info.chat_id })
    }
    else {
      return
    }
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
            <li className='usermessage mymessage rounded-4'>
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
            <li className='usermessage rounded-4'>
              <div>
                <p >@{id}</p>
                <p className='timestampP'>{timestamp}</p>
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
        {chatHistory.history ? <h1>Welcome in {chatHistory.history.chat_info.chat_name}</h1> : <h1>Welcome! Select room to chat</h1>}

        <ul>
          {messageList.slice().reverse().map((message, index) => (
            <Message key={index} prop={message}></Message>
          ))}
        </ul>
        <form className='sendblock input-group' onSubmit={sendMessage}>
          <input type="text" placeholder='Type your message' className="form-control" />
          <button type='submit' className='btn btn-light d-flex'>Send</button>
        </form>
      </div>
    </>
  )
}
export default Chatblock