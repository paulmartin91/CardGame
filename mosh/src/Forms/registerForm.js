import React from 'react';

const RegisterForm = ({validate, styles, handleChange, handleSubmit, errors, registerData, registerSchema}) => 

  <div className="border d-flex flex-column align-items-start p-3 w-50" >
      <div className="w-100 px-3 pt-3">
          <form className="form-group" name="createAccount" onSubmit={handleSubmit}>
              <div className ="input-group form-group">
                  <input 
                      onChange={event => handleChange(event)} 
                      name="registerUsername"
                      className="form-control" 
                      placeholder="username"
                  />
                  <input 
                      onChange={event => handleChange(event)} 
                      name="registerPassword"
                      type="password"
                      className="form-control" 
                      placeholder="password"
                  />
              </div>
              <div className ="input-group">
                  <input
                      onChange={event => handleChange(event)} 
                      name="registerEmail"
                      className="form-control" 
                      placeholder="email"
                  />
                  <div className="input-group-append">
                      <button 
                          className="btn btn-primary"
                          disabled={validate(registerData, registerSchema)}
                          type="submit"
                      >
                          Create Account
                      </button>
                  </div>
              </div>
          </form>
      </div>
      <div className="mt-2 pl-3" style={styles.errors}>
          {errors && errors.registerUsername}
          {errors && !errors.registerUsername && errors.registerPassword}
          {errors && !errors.registerUsername && !errors.registerPassword && errors.registerEmail}
      </div>
  </div>



export default RegisterForm