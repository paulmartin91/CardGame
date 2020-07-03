import React, { useState } from 'react';

const Lobby = ({socket}) => {

    return (
        <div>
            <button onClick={()=>console.log(socket.username)}>TEST</button>
        </div>
    )
}

export default Lobby

// import React, { useState, useEffect } from 'react';
// import queryString from 'query-string';
// import io from 'socket.io-client';
// import { findSourceMap } from 'module';
// import {Link} from 'react-router-dom';

// let socket;

// const Lobby = ({ location }) => {
//     const [name, setName] = useState('');
//     const [password, setPassword] = useState('');
//     const ENDPOINT = 'localhost:3001'

//     useEffect(() => {
//         const { name, password } = queryString.parse(location.search)

//         socket = io(ENDPOINT)

//         setName(name)
//         setPassword(password)
//     }, [ENDPOINT, location.search])

//     let callServer = () => {
//         console.log(name, password)
//         socket.emit('find', ({name, password}))
//     }

//     return(
//         <div>
//             <button onClick={callServer}>Call Server</button>
//             <Link onClick={event => !name && event.preventDefault()} to={`./gamesearch`}>
//                 <button type="submit">TEST</button>
//             </Link>
//         </div>    
//     )   
// }

// export default Lobby