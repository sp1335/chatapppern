import './css/App.css';
import './css/Chat.css';
import Dashboard from './components/Dashboard';
import React, { useState, useEffect } from 'react'
import Auth from './components/Auth';
import { Routes, Route } from 'react-router-dom'
import axios from 'axios';
import Cookies from 'js-cookie';

function App() {
  const [user, setuser] = useState()
  const [errorState, seterrorState] = useState('')
  const API_URL = process.env.REACT_APP_API_URL

  useEffect(() => {
    if (Cookies.get() !== {}) {
      axios.post(`${API_URL}/verifyToken`,
        {},
        {
          withCredentials: true,
          credentials: 'include',
        }
      ).then((res) => {
        if(res.status === 200 || res.status === 201)
        setuser(res.data.user)
      }).catch((err) => {
        console.log(err)
      })
    }
  }, [])
  return (
    <>
      <Routes>
        <Route path='*' element={Object.keys(Cookies.get()).length === 0 ? <Auth errorState={errorState} seterrorState={seterrorState} /> : <Dashboard errorState={errorState} seterrorState={seterrorState} user={user} />}></Route>
      </Routes>
    </>
  );
}

export default App;
