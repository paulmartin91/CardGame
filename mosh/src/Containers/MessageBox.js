import React, { useState, useRef, useEffect } from 'react';

import socket from '../Services/Socket/socket'

const MessageBox = ({ username, messages, setMessages }) => {

    const [message, setMessage] = useState([])
    const messageBoxRef = useRef(null)

    useEffect(() => {
        socket.on('server_response_send_message', ({time, username, message}) => {
            setMessages(oldMessages => [...oldMessages, {time, username, message}])
            if (messageBoxRef.current) messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight
        })
    }, []);

    const handleSubmit = event => {
        sendMessage(message)
        setMessage('')
        event.preventDefault();
    }

    const sendMessage = message => socket.emit(`client_request_send_message`, message)

    return (
        <div className="mt-5">
            <div className="border">
                <div id="messageBox" style={{cursor: "default", height: 150, overflow: "scroll"}} ref={messageBoxRef}>
                    <div id="messages" style={{wordBreak: "break-all"}}>
                        { messages.map(({time, username, message}, index) => 
                            <p key={index} className='m-0'>
                                <span className="text-muted small">
                                    {time == 'n/a' ? '' : time}
                                </span>
                                <span color='red'>{username}: {message}</span>
                            </p>
                        )}
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input type="text" style={{borderRadius: 0}} name="message" className="border form-control" placeholder="Type message..." id="messagesInput" value={message} onChange={({target}) => setMessage(target.value)}/>
                        <div className="input-group-append">
                            <button className="btn btn-outline-secondary" type="submit" style={{borderRadius: 0}} disabled={message.length==0} >Send Message</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default MessageBox;