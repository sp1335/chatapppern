import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import io from "socket.io-client"

function RoomsList(props) {
    const socket = io('http://localhost:5000', {
        withCredentials: true
    })
    const {chatHistory, setChatHistory} = props
    const [roomList, setroomList] = useState([])
    const [activeItem, setActiveItem] = useState()
    const API_URL = process.env.REACT_APP_API_URL
    const { access_token, user_id } = Cookies.get()

    useEffect(() => {
        if (Cookies.get() !== {}) {
            axios.get(`${API_URL}/fetchRoomList`, {
                headers: {
                    cookies: Cookies.get()
                },
                withCredentials: true,
                credentials: 'include',
            }).then((res) => {
                if (res.status === 200)
                    setroomList(res.data.data)
            }).catch((err) => {
                console.log(err)
            })
        }
    }, [user_id])

    const handleRoomItemClick = (chatid) => {
        setActiveItem('')
        setActiveItem(chatid)
        setChatHistory([])
        if (access_token && user_id) {
            socket.emit('join', {
                token: access_token,
                user_id: user_id,
                chat_id: chatid
            })
        }
    }
    socket.on('join_error', (data) => {
        console.log(data.message)
    })
    socket.on('history', ({history}) => {
        if(history.data){
            setChatHistory({history})
        }else{
            console.log('Chat is empty')
        }
    })
    return (
        <div className='roomsList container overflow-scroll scrollbar-secondary'>
            {roomList.length ? (
                roomList.map((room) => (
                    <div key={room.chat_id} className={`roomItem list-group-item rounded-0 ${room.chat_id === activeItem ? ' active' : ''}`} onClick={(e) => handleRoomItemClick(room.chat_id)} >
                        <div className='roomItemImg avaColor'></div>
                        <div className='roomItemText'>
                            <p className="roomName">{room.chat_name}</p>
                            <p className="roomLastMessage">Room last message</p>
                        </div>
                    </div>
                ))
            ) : (
                <p className='d-flex text-muted'>...No chat rooms yet</p>
            )
            }
        </div >
    )
}

export default RoomsList