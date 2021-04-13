import React, { useState, useEffect} from 'react';
import { Link, Redirect, useRouteMatch } from "react-router-dom";
import Joi, { schema } from 'joi-browser'

import { login } from '../Services/authservice'
import { register } from '../Services/registerService'
import LoginForm from '../Forms/loginForm';
import RegisterForm from '../Forms/registerForm';
import { validate } from '../utils/validation'
import {getCurrentUser} from '../Services/authservice'

const Login = ({match, history, location, setUsername}) => {

    const [loginData, setLoginData] = useState({loginUsername: "", loginPassword: ""})
    const [registerData, setRegisterData] = useState({registerUsername: "", registerPassword: "", registerEmail: ""})
    const [errors, setErrors] = useState(null)//({login: "", createAccount: ""})

    useEffect(() => {
        
    }, [])

    const schema = {
        loginUsername: Joi.string().label('Username').required(),
        loginPassword: Joi.string().label('Password').required(),
        registerUsername: Joi.string().label('Username').required(),
        registerPassword: Joi.string().label('Password').required(),
        registerEmail: Joi.string().label('Email').required()
    }

    const loginSchema = {
        loginUsername: Joi.string().required(),
        loginPassword: Joi.string().required(),
    }

    const registerSchema = {
        registerUsername: Joi.string().required(),
        registerPassword: Joi.string().required(),
        registerEmail: Joi.string().required()
    }

    // const validate = isLogin => {
    //     const { error } = Joi.validate(isLogin ? loginData : registerData, isLogin ? loginSchema : registerSchema)
    //     if (!error) return null
    //     const tempErrors = {}
    //     error.details.forEach(item => tempErrors[item.path[0]] = item.message)
    //     return tempErrors
    // }

    const validateProperty = ({name, value}) => {
        //init the temp oject to validate
        const obj = {[name]: value}
        //init the schema
        const tempSchema = {[name]: schema[name]}
        //validate the temp object
        const {error} = Joi.validate(obj, tempSchema)
        //return errors if any
        return error ? error.details[0].message : null     
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const isLogin = event.target.name == 'login'
        const tempErrors = validate(isLogin ? loginData : registerData, isLogin ? loginSchema : registerSchema )
        setErrors(tempErrors || {})
        if (errors === {}) return
        if (isLogin){
            try {
                await login(loginData.loginUsername, loginData.loginPassword)
                const {state} = location
                history.push(state ? state.from.pathname : "/gamesearch")
            } catch (ex) {
                if (ex.response && ex.response.status === 400) {
                    const tempErrors = {...errors}
                    tempErrors.loginUsername = ex.response.data
                    setErrors(tempErrors)
                }
            }
        } else {
            try {
                const response = await register(registerData.registerUsername, registerData.registerPassword, registerData.registerEmail)
                localStorage.setItem('token', response.headers['x-auth-token'])
                history.push("/gamesearch")
            } catch (ex) {
                if (ex.response && ex.response.status === 400) {
                    const tempErrors = {...errors}
                    tempErrors.registerUsername = ex.response.data
                    setErrors(tempErrors)
                }
            }
        }

    }

    const handleChange =({currentTarget: input}) => {
        const isLogin = (input.name == 'loginUsername') || (input.name == 'loginPassword')
        const tempErrors = {...errors}
        const errorMessage = validateProperty(input)
        if (errorMessage) {
            tempErrors[input.name] = errorMessage
        }
        else delete tempErrors[input.name]
        setErrors(tempErrors)
        isLogin ? setLoginData({...loginData, [input.name]: input.value}) : setRegisterData({...registerData, [input.name]: input.value})
    }

    if (getCurrentUser()) return <Redirect to="/gamesearch" /> 

    return (
        <main id = "loginPage" className="container d-flex flex-column align-items-center text-center">
            {/* Titles */}
            <h1 className="text-center mt-5 title">Deck of Cards</h1>
            <h4 className=" mt-5 title" >A place to sit and play cards. You can play with friends, find a game to join or host your own game. Login or create an account below to get started.</h4>

            {/* Login Container */}
            <div className="container-fluid mt-4 d-flex flex-column align-items-center">

                <LoginForm 
                    validate = {validate}
                    loginData = {loginData}
                    loginSchema = {loginSchema}
                    styles = {styles}
                    handleChange = {handleChange}
                    handleSubmit = {handleSubmit}
                    errors = {errors}
                />

                <RegisterForm 
                    validate = {validate}
                    registerData = {registerData}
                    registerSchema = {registerSchema}
                    styles = {styles}
                    handleChange = {handleChange}
                    handleSubmit = {handleSubmit}
                    errors = {errors}
                />
            </div>

        </main>
    )
}

const styles = {
    errors: {
        minHeight: 25,
        color: 'tomato'
    }
}

export default Login;