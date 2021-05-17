import React, { useState, useRef } from 'react';

const MessageBox = ({ username, sendMessage, messages, setMessages }) => {

    const [message, setMessage] = useState([])
    // const chatBox = useRef(null)

    const handleSubmit = event => {
        sendMessage(message)
        setMessage('')
        // socket.emit(`client_request_send_message`, message)
        //     // setMessages( oldMessages => [...oldMessages, {'time': 'x', 'username': username, 'message': message}])
        //     // setMessage('')
        //     //     message: event.target.message.value,
        //     //     location: 'Lobby',
        //     // })

        event.preventDefault();
    }

    return (
        <div className="mt-5">
            <div className="border">
                <div id="messageBox" style={{cursor: "default", height: 150, overflow: "scroll"}} >
                    <ul id="messages" style={{wordBreak: "break-all", padding: 5}}>
                        { messages.map(({time, username, message}, index) => 
                            <li key={index}>
                                <span className="text-muted small">
                                    {time == 'n/a' ? '' : time}
                                </span>
                                {username}: {message}
                            </li>
                        )}
                    </ul>
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