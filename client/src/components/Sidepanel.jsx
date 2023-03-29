import axios from 'axios';
import React from 'react'
import RoomsList from './RoomsList'
import Cookies from 'js-cookie';

function Sidepanel(props) {
    const { user, chatHistory, setChatHistory } = props
    const handleLogout = async (e) => {
        const API_URL = process.env.REACT_APP_API_URL
        e.preventDefault();
        if (Cookies.get() !== {}) {
            axios.post(`${API_URL}/signout`,
                {},
                {
                    withCredentials: true,
                    credentials: 'include',
                }
            ).then((res) => {
                if (res.status === 200)
                    window.location.href = '/';
            }).catch((err) => {
                console.log(err)
            })
        }
    }
    return (
        <>
            <div className='Sidepanel'>
                < div className='userInfo' >
                    <div className='userAva avaColor'></div>
                    <div className='userInfoText'>
                        <p className='userName'>Welcome, {user.name}</p>
                        <p className='userDetail text-secondary'>{user.email}</p>
                    </div>
                </div >
                <div className='SidepanelSearch'>
                    <input type="text" className='form-control' placeholder='Find chat' />
                </div>
                <RoomsList user={user} chatHistory={chatHistory} setChatHistory={setChatHistory}/>
                <div className='d-flex '><button className='btn btn-light logOutBtn' onClick={handleLogout}>Log out</button></div>
            </div >
        </>
    )
}

export default Sidepanel