import Cookies from 'js-cookie'
import React from 'react'
import Sidepanel from './Sidepanel'
import Chatblock from './Chatblock'
import Rightpanel from './Rightpanel'
import Loading from './Loading'
export default function Dashboard(props) {
  const { errorState, setErrorState, user } = props
  return (
    <>
      {user ?
        <div className='Dashboard'>
          < Sidepanel user={user} />
          <Chatblock />
          <Rightpanel />
        </div >
        : <Loading />}
    </>
  )
}
