import React from 'react';
import { Route, Redirect } from 'react-router-dom'

import {getCurrentUser} from '../../Services/authservice'

const ProtectedRoute = ({path, location, component: Component, render, gameName, ...rest}) => 
  <Route
    {...rest}
    render={props => {
      if (!getCurrentUser()) return <Redirect to={{
        pathname: '/login',
        state: {from: location}
      }} />
      if (gameName) return <Redirect to={{
        pathname: '/gamelobby',
        state: {from: location}
      }} />
      return Component ? <Component {...props} /> : render(props)
    }} 
  />

  export default ProtectedRoute