import React from 'react'

export default function Dashboard(props) {
  const {errorState, setErrorState} = props
  return (
    <>
      <h1>Dashboard</h1>
      <label className='text-danger'>{errorState}</label>
    </>
  )
}
