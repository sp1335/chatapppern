import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import io from "socket.io-client"

import ChatParticipants from './ChatParticipants'

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
          setMessageList(prevState => [...prevState, [message.message_type, message.message_body, message.roommate_user_user_id, message.event_timestamp, message.user_name]])
        })
      } else {
        setMessageList([['infomessage', 'No messages yet...']])
      }
    }
  }, [chatHistory])
  const showChatRoommates = () => {
    console.log('first')
  }
  useEffect(() => {
    if (access_token && user_id) {
      socket.emit('join', {
        token: access_token,
        user_id: user_id
      })
    }
    socket.on('newMessage', (message) => {
      if (message === '') { console.log('empty') }
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
    const username = prop.prop[4]
    const date = new Date(timestamp)
    let localTime = date.toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' });
    let localDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
    let formattedDate = localTime + "," + localDate.replace(/\//g, '-');
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
              <p className='messageP'>{message}</p>
              <div className='timestamp'>
                <p >{username}</p>
                <p className='timestampP'>{formattedDate}</p>
              </div>
            </li>
          </div>
        )
      } else {
        return (
          <div className='d-flex'>
            <li className='usermessage notmymessage rounded-4'>
              <p className='messageP'>{message}</p>
              <div className='timestamp'>
                <p >{username}</p>
                <p className='timestampP'>{formattedDate}</p>
              </div>
            </li>
          </div>
        )
      }
    }
  }
  return (
    <>
      <div className='chatblock'>
        {chatHistory.history ?
          <ChatParticipants chatHistory={chatHistory.history} /> : null}
        <div className='chatname'>
          {chatHistory.history ?
            <div className='chatinfo'>
              <h3>Welcome in {chatHistory.history.chat_info.chat_name}</h3>
              <span onClick={() => showChatRoommates()}>
                {chatHistory.history.chat_members.length === 1 ?
                  <p className='text-muted'>{chatHistory.history.chat_members.length} mate</p>
                  :
                  <p className='text-muted'>{chatHistory.history.chat_members.length} mates</p>}
              </span>
            </div>
            :
            <h3>Welcome! Select room to chat</h3>
          }
        </div>
        <div className='chatbody'>
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
      </div >

    </>
  )
}
export default Chatblock






