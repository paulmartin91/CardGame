import React, { useState } from 'react';
import Joi from 'joi-browser'

const LoginForm = ({validate, handleChange, handleSubmit, errors, loginData, loginSchema}) => 

    <div className="border d-flex flex-column align-items-start p-3 w-50" >
      <div className="w-100 px-3 pt-3">
          <form className="input-group" name="login" onSubmit={handleSubmit}>
              <input 
                  autoFocus 
                  // value={loginInformation.username}
                  name='loginUsername'
                  onChange={event => handleChange(event)} 
                  className="form-control" 
                  placeholder="username"
              />
              <input
                  //={loginInformation.password}
                  //onChange={({target}) => setLoginInformation({... loginInformation, password: target.value})} 
                  name="loginPassword"
                  onChange={event => handleChange(event)} 
                  type="password" 
                  className="form-control" 
                  placeholder="password" 
              />
              <div className="input-group-append">
                  <button 
                      className="btn btn-primary" 
                      type="submit"
                    //   disabled={validate(true)}
                      disabled={validate(loginData, loginSchema)}
                  >
                      Login
                  </button>
              </div>
          </form>
      </div>
      <div className="mt-2 pl-3" style={{minHeight: 25, color: 'tomato'}}>
          {errors && errors.loginUsername}
          {errors && !errors.loginUsername && errors.loginPassword}
      </div>
    </div>

export default LoginForm;