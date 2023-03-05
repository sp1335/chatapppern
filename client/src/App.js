import './App.css';
import Dashboard from './components/Dashboard';
import React, { useState } from 'react'
import Auth from './components/Auth';
import { Routes, Route } from 'react-router-dom'
import axios from 'axios';
import Cookies from 'js-cookie';

function App() {
  const { user_id, access_token } = Cookies.get()
  const [errorState, seterrorState] = useState('')
  if (Cookies.get() !== {}) {
    const API_URL = process.env.REACT_APP_API_URL
    axios.post(`${API_URL}/verifyToken`,
      {
        user_id, access_token
      })
      .then((res) => { console.log(res.data.message) })
      .catch((err) => {
        seterrorState(err.response.data.message)
        console.log(err.response.status)
        const errorCode = err.response.status
        if (errorCode === 496||errorCode===498) {
          Cookies.remove('user_id')
          Cookies.remove('access_token')
        } else if (errorCode === 401) {
          console.log('Expired token')
        }else{
          console.log('Unexprected token error')
        }
      })
  } else {
    console.log('no cookie')
  }
  return (
    <>
      <Routes>
        <Route path='*' element={Object.keys(Cookies.get()).length === 0 ? <Auth errorState={errorState} seterrorState={seterrorState} /> : <Dashboard errorState={errorState} seterrorState={seterrorState} />}></Route>
        <Route path='/auth' element={<Auth errorState={errorState} seterrorState={seterrorState} />} />
      </Routes>
    </>
  );
}

export default App;
