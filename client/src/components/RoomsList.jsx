import axios from 'axios'
import React, { useState, useEffect } from 'react'

function RoomsList(props) {
    const [roomList, setroomList] = useState([])
    const API_URL = process.env.REACT_APP_API_URL
    const { user_id } = props
    const fetchRoomList = async () => {
        try {
            axios.post(`${API_URL}/fetchRoomList`, {}, {
                withCredentials: true,
                credentials: 'include',
            })
                .then((res) => {
                    if (res.status === 200) {
                        console.log(res)
                    } else {
                        console.log(res)
                    }
                })
        } catch (error) {
            return console.log(error.message)
        }
    }
    useEffect(() => {
        fetchRoomList()
    }, [user_id])

    return (
        <div className='roomsList container overflow-scroll scrollbar-secondary'>
            <div className='roomItem list-group-item active rounded-0'>
                <div className='roomItemImg avaColor'></div>
                <div className='roomItemText'>
                    <p className="roomName">Room name</p>
                    <p className="roomLastMessage">Room last message</p>
                </div>
            </div>
            <div className='roomItem list-group-item rounded-0'>
                <div className='roomItemImg avaColor'></div>
                <div className='roomItemText'>
                    <p className="roomName">Room name</p>
                    <p className="roomLastMessage">Room last message</p>
                </div>
            </div>
            <div className='roomItem list-group-item rounded-0'>
                <div className='roomItemImg avaColor'></div>
                <div className='roomItemText'>
                    <p className="roomName">Room name</p>
                    <p className="roomLastMessage">Room last message</p>
                </div>
            </div>
            <div className='roomItem list-group-item rounded-0'>
                <div className='roomItemImg avaColor'></div>
                <div className='roomItemText'>
                    <p className="roomName">Room name</p>
                    <p className="roomLastMessage">Room last message</p>
                </div>
            </div>
            <div className='roomItem list-group-item rounded-0'>
                <div className='roomItemImg avaColor'></div>
                <div className='roomItemText'>
                    <p className="roomName">Room name</p>
                    <p className="roomLastMessage">Room last message</p>
                </div>
            </div>
            <div className='roomItem list-group-item rounded-0'>
                <div className='roomItemImg avaColor'></div>
                <div className='roomItemText'>
                    <p className="roomName">Room name</p>
                    <p className="roomLastMessage">Room last message</p>
                </div>
            </div>
            <div className='roomItem list-group-item rounded-0'>
                <div className='roomItemImg avaColor'></div>
                <div className='roomItemText'>
                    <p className="roomName">Room name</p>
                    <p className="roomLastMessage">Room last message</p>
                </div>
            </div>
            <div className='roomItem list-group-item rounded-0'>
                <div className='roomItemImg avaColor'></div>
                <div className='roomItemText'>
                    <p className="roomName">Room name</p>
                    <p className="roomLastMessage">Room last message</p>
                </div>
            </div>
            <div className='roomItem list-group-item rounded-0'>
                <div className='roomItemImg avaColor'></div>
                <div className='roomItemText'>
                    <p className="roomName">Room name</p>
                    <p className="roomLastMessage">Room last message</p>
                </div>
            </div>
            <div className='roomItem list-group-item rounded-0'>
                <div className='roomItemImg avaColor'></div>
                <div className='roomItemText'>
                    <p className="roomName">Room name</p>
                    <p className="roomLastMessage">Room last message</p>
                </div>
            </div>
        </div>
    )
}

export default RoomsList