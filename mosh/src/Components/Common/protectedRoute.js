import React from 'react';
import { Route, Redirect } from 'react-router-dom'

import {getCurrentUser} from '../../Services/authservice'

const ProtectedRoute = ({path, location, component: Component, render, gameName, playerList, ...rest}) => 
  <Route
    {...rest}
    render={props => {
      if (!getCurrentUser()) return <Redirect to={{
        pathname: '/login',
        state: {from: location}
      }} />
      return Component ? <Component {...props} /> : render(props)
    }} 
  />

  export default ProtectedRoute