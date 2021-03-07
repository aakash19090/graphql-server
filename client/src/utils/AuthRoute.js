// Can be considered as Protected Routes based on  User Authentication 

import React, { useContext } from 'react'
import { AuthContext } from '../context/auth'
import { Route, Redirect } from 'react-router-dom'


const AuthRoute = ( {component : Component, ...props} ) => {
    const { user } = useContext(AuthContext)
    return (
        <Route {...props} render={ props => user ? <Redirect to="/"/> : <Component {...props}/> }/>
    )
}

export default AuthRoute
