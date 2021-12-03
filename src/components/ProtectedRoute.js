import React, { Component } from 'react'
import {Navigate} from 'react-router-dom';

export default class ProtectedRoute extends Component {
    render() {
        return this.props.token ?(
            this.props.children
        ):(
            <Navigate to={{pathname:"/login"}}/>
        )
            
        
    }
}