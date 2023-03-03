import React, { useState } from 'react'
import axios from 'axios'
import bcrypt from 'bcryptjs';
export default function Auth() {
  const [authState, setAuthState] = useState(true)
  const [errorState, seterrorState] = useState('')
  const API_URL = process.env.REACT_APP_API_URL
  const handleAuthState = (e) => {
    e.preventDefault()
    setAuthState(!authState)
  }
  const changeErrorLabel = (error) => {
    seterrorState(error)
    setTimeout(() => {
      seterrorState('')
    }, 5000)
  }
  async function handleAuth(e) {
    e.preventDefault()
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    const nameRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    const username = e.target.username.value;
    const password = e.target.password.value;
    if (!nameRegex.test(username)) {
      return changeErrorLabel('Invalid username')
    } else if (!passwordRegex.test(password)) {
      return changeErrorLabel('Invalid password')
    } else {
      if (authState) {
        try {
          await axios.post(`${API_URL}/signin`,{username,password})
          .then((res)=>{
            // window.location.href = '/';
          })
        } catch (error) {
          return changeErrorLabel(error.message)
        }
      } else {
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        const email = e.target.email.value;
        if (!passwordRegex.test(password)) return changeErrorLabel('Invalid email')
        alert("Form submited OK")
      }

    }
  }
  const signUpForm = () => {
    return (
      <form className='d-flex flex-column mt-3' onSubmit={handleAuth}>
        <div>
          <label className='text'>Username</label>
          <input type="text" className="form-control shadow-none" id='username' placeholder='Username' />
        </div>
        <div>
          <label className='text'>Email</label>
          <input type="email" className="form-control shadow-none" id='email' placeholder='Email' />
        </div>
        <div>
          <label className='text'>Password</label>
          <input type="password" className="form-control shadow-none" id='password' placeholder='Password' />
        </div>
        <button type='submit' className='btn btn-primary mt-3'>{authState ? 'Sign in' : 'Sign up'}</button>
      </form>
    )
  }
  const signInForm = () => {
    return (
      <form className='d-flex flex-column mt-3' onSubmit={handleAuth}>
        <div>
          <label className='text'>Username</label>
          <input type="text" className="form-control shadow-none" id='username' placeholder='Username' />
        </div>
        <div>
          <label className='text'>Password</label>
          <input type="password" className="form-control shadow-none" id='password' placeholder='Password' />
        </div>
        <button type='submit' className='btn btn-primary mt-3'>{authState ? 'Sign in' : 'Sign up'}</button>
      </form>
    )
  }
  return (
    <div className='AuthComponent d-flex flex-column rounded border align-items-md-center pb-5'>
      <h2>Шо ты дядя</h2>
      <label className={`text-danger fs-6 errorLabel ${errorState ? 'show-error' : 'hide-error'}`}>{errorState}</label>
      {authState ? signInForm() : signUpForm()}
      <label className='text-secondary'>
        {authState ? `Don't have an account?` : `Already have an account?`}
        <span className='link-dark' onClick={handleAuthState}>
          {authState ? ' Sign up' : ' Sign in'}
        </span>
      </label>
    </div>

  )
}