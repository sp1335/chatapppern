import Cookies from 'js-cookie'
import React, { useState } from 'react'
import Sidepanel from './Sidepanel'
import Chatblock from './Chatblock'
import Rightpanel from './Rightpanel'
import Loading from './Loading'
export default function Dashboard(props) {
  const [chatHistory, setChatHistory] = useState([])
  const { errorState, setErrorState, user } = props
  return (
    <>
      {user ?
        <div className='Dashboard'>
          < Sidepanel user={user} chatHistory={chatHistory} setChatHistory={setChatHistory} />
          <Chatblock chatHistory={chatHistory} setChatHistory={setChatHistory} />
          <Rightpanel />
        </div >
        : <Loading />}
    </>
  )
}
