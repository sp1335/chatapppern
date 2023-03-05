import Cookies from 'js-cookie'
import React from 'react'

export default function Dashboard(props) {
  const {errorState, setErrorState} = props
  return (
    <>
      <h1>Dashboard</h1>
      <h3>Welcome, {Cookies.get('user_id')}</h3>
      <label className='text-danger'>{errorState}</label>
    </>
  )
}
