import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function ChatParticipants(props) {
    const chatHistory = props
    console.log(chatHistory)
    const chatName = chatHistory.chatHistory.chat_info.chat_name
    const chatMembers = [...chatHistory.chatHistory.chat_members]
    console.log(chatMembers)
    return (
        <div className='chatpartspopup'>
            <div className='cppBlock rounded py-3'>
                <div className='px-4 py-2'>
                    <h4>{chatName}</h4>
                </div>
                <div className='px-3'>
                    <div className='participant rounded'>
                        <p>Photos</p>
                    </div>
                    <div className='participant rounded'>
                        <p>Videos</p>
                    </div>
                    <div className='participant rounded'>
                        <p>Audios</p>
                    </div>
                    <div className='participant rounded'>
                        <p>Links</p>
                    </div>
                </div>
                <div>
                    <div>

                        <p className='px-4 py-2 fs-5'>{chatMembers.length} member</p>
                    </div>
                    {chatMembers.map((participant, key) => (
                        <div className='participant rounded' key={key}>
                            <p className='px-3'>{chatMembers[key].name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ChatParticipants