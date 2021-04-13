import React, { useState } from 'react';

const MessageBox = ({ username }) => {

    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState([])

    const handleSubmit = event => {
        if (message.length > 0) {
            console.log(message )
            setMessages( oldMessages => [...oldMessages, {'time': 'x', 'username': username, 'message': message}])
            setMessage('')
            // socket.emit(`send message`, {
            //     message: event.target.message.value,
            //     username: socket.username,
            //     location: 'Lobby',
            // })
        }

        event.preventDefault();
    }

    return (
        <div className="mt-5">
            <div className="border">
                <div id="messageBox" style={{cursor: "default", height: 150, overflow: "scroll"}}>
                    <p id="messages" style={{wordBreak: "break-all"}}>
                        { messages.map( message => <p1><span className="text-muted small">{message.time == 'n/a' ? '' : [message.time]}</span>{message.username}: {message.message}<br /></p1>) }
                    </p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input type="text" style={{borderRadius: 0}} name="message" className="border form-control" placeholder="Type message..." id="messagesInput" value={message} onChange={({target}) => setMessage(target.value)}/>
                        <div className="input-group-append">
                            <button className="btn btn-outline-secondary" type="submit" style={{borderRadius: 0}}>Send Message</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default MessageBox;