import React, { useState, useEffect} from 'react';

const Login = ({socket, ENDPOINT, setPageDirect}) => {

    //States
    
    //Login
    const [loginUsername, setLoginUsername] = useState('')
    const [loginPassword, setLoginPassword] = useState('')
    const [loginUsernameInvalid, setLoginUsernameInvalid] = useState(false)
    const [loginUsernameAlreadyLoggedIn, setLoginUsernameAlreadyLoggedIn] = useState(false)
    const [loginPasswordInvalid, setLoginPasswordInvalid] = useState(false)

    //Create Account
    const [createAccountUsername, setCreateAccountUsername] = useState('')
    const [createAccountPassword, setCreateAccountPassword] = useState('')
    const [createAccountEmail, setCreateAccountEmail] = useState('')
    const [createAccountUsernameExists, setCreateAccountUsernameExists] = useState(false)
    const [createAccountEmailExists, setCreateAccountEmailExists] = useState(false)
    // const [createAccountUsernameInvalid, setCreateAccountUsernameInvalid] = useState(false)
    // const [createAccountPasswordInvalid, setCreateAccountPasswordInvalid] = useState(false)
    // const [createAccountEmailInvalid, setCreateAccountEmailInvalid] = useState(false)
    const [createAccountSuccess, setCreateAccountSuccess] = useState(false)
        
    useEffect(() => {
        
        //Handle Login Response
        socket.on('log in attempt response', response => {
            console.log(response)
            if (response.success) {
                socket.username = response.username
                setPageDirect('GameSearch')
            } else if (!response.exists) {
                //Hide other warnings
                setLoginUsernameAlreadyLoggedIn(false)
                setLoginPasswordInvalid(false)
                //Show This Warning
                setLoginUsernameInvalid(true)
            } else if (response.alreadyLoggedIn) {
                //Hide other warnings
                setLoginPasswordInvalid(false)
                setLoginUsernameInvalid(false)
                //Show This Warning
                setLoginUsernameAlreadyLoggedIn(true)
            } else if (!response.password) {
                //Hide other warnings
                setLoginUsernameAlreadyLoggedIn(false)
                setLoginUsernameInvalid(false)
                //Show This Warning
                setLoginPasswordInvalid(true)
            }
        })

        //Handle Create New Account Response
        socket.on('new user response', response => {
            console.log(response)
            if (response.success) {
                //Set Login Credentials
                setLoginUsername(response.username);
                setLoginPasswordInvalid(false);
                //Hide other warnings
                setCreateAccountEmailExists(false)
                setCreateAccountUsernameExists(false)
                //Show This Warning
                setCreateAccountSuccess(true);
            } else if (response.reason == 'Email address already exists') {
                //Hide other warnings
                setCreateAccountUsernameExists(false)
                setCreateAccountSuccess(false)
                //Show This Warning
                setCreateAccountEmailExists(true)
            } else if (response.reason == 'Username already exists') {
                //Hide other warnings
                setCreateAccountEmailExists(false)
                setCreateAccountSuccess(false)
                //Show This Warning
                setCreateAccountUsernameExists(true)
            }
        })

    }, [ENDPOINT])

    const handleSubmit = event => {

        event.target.name == 'login' ?

        socket.emit('login attempt', {
            username: loginUsername,
            password: loginPassword
        })
        :
        socket.emit('new user request', {
            username: createAccountUsername,
            password: createAccountPassword,
            email: createAccountEmail
        })
        
        event.preventDefault();
    }

    return (
        <div>
            <div id = "loginPage" className="container text-center">
                {/* Titles */}
                <h1 className="text-center mt-5 title">Deck of Cards</h1>
                <h4 className=" mt-5 title" >A place to sit and play cards. You can play with friends, find a game to join or host your own game. Login or create an account below to get started.</h4>

                {/* Login Container */}

                {/* Login */}
                <div className = "border container loginBody" >
                    <form className="input-group mb-3" name="login" onSubmit={handleSubmit}>
                        <input value={loginUsername} type="text" className="form-control" placeholder="username" required autofocus onChange={event => setLoginUsername(event.target.value)}/>
                        <input value={loginPassword} type="password" className="form-control" placeholder="password" pattern=".{6,}" required onChange={event => setLoginPassword(event.target.value)}/>
                        <div className="input-group-append">
                            <button className="btn btn-primary" type="submit">Login</button>
                        </div>
                    </form>

                    {/* Warnings */}
                    <div style={{minHeight: 60, minWidth: "100%"}}>
                        <div className="alert alert-warning alert-dismissible fade show" style={{display: loginUsernameInvalid ? '' : 'none'}}>
                            Username doesn't exist
                            <button type="button" class="close">
                                <span onClick={() => setLoginUsernameInvalid(false)} style={{cursor: "pointer"}}>&times;</ span>
                            </button>
                        </div>
                        <div className="alert alert-warning alert-dismissible fade show" style={{display: loginUsernameAlreadyLoggedIn ? '' : 'none'}}>
                            User already logged in
                            <button type="button" class="close">
                                <span onClick={() => setLoginUsernameAlreadyLoggedIn(false)} style={{cursor: "pointer"}}>&times;</ span>
                            </button>
                        </div>
                        <div className="alert alert-warning alert-dismissible fade show" style={{display: loginPasswordInvalid ? '' : 'none'}}>
                            Password invalid
                            <button type="button" class="close">
                                <span onClick={() => setLoginPasswordInvalid(false)} style={{cursor: "pointer"}}>&times;</ span>
                            </button>
                        </div>
                    </div>

                    {/* Create New User */}
                    <form className="form-group" onSubmit={handleSubmit}>
                        <div className ="input-group form-group">
                            <input name="username" className="form-control" placeholder="username" required onChange={event => setCreateAccountUsername(event.target.value)}/>
                            <input name="password" type="password" className="form-control" placeholder="password" pattern=".{6,}" onInvalid="this.setCustomValidity(`Minimum 6 characters`)" required onChange={event => setCreateAccountPassword(event.target.value)/*"try{setCustomValidity('')}catch(e){}"*/} />
                        </div>
                        <div className ="input-group">
                            <input name="email" type="email" className="form-control" placeholder="email" required onChange={event => setCreateAccountEmail(event.target.value)} />
                            <div className="input-group-append">
                                <button type="submit" className="btn btn-primary">Create Account</button>
                            </div>
                        </div>
                    </form>

                    {/* Warnings */}
    
                    <div style={{minHeight: 60, minWidth: "100%"}}>
                        <div className="alert alert-warning alert-dismissible fade show" style={{display: createAccountEmailExists ? '' : 'none'}}>
                            Email already in use
                            <button type="button" class="close">
                                <span onClick={() => setCreateAccountEmailExists(false)} style={{cursor: "pointer"}}>&times;</ span>
                            </button>
                        </div>

                        <div className="alert alert-warning alert-dismissible fade show" style={{display: createAccountUsernameExists ? '' : 'none'}}>
                            Username already in use
                            <button type="button" class="close">
                                <span onClick={() => setCreateAccountUsernameExists(false)} style={{cursor: "pointer"}}>&times;</ span>
                            </button>
                        </div>

                        <div className="alert alert-success alert-dismissible fade show" style={{display: createAccountSuccess ? '' : 'none'}}>
                            Account Created!
                            <button type="button" class="close">
                                <span onClick={() => setCreateAccountSuccess(false)} style={{cursor: "pointer"}}>&times;</ span>
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login