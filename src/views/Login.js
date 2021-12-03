import React, { Component } from 'react';
import * as Yup from 'yup';
import {Formik, Form, Field} from 'formik';
import Button from 'react-bootstrap/Button';
import getToken from '../api/apiBasicAuth';
import {Navigate} from 'react-router-dom';

const loginFormSchema  = Yup.object().shape({
    "username":Yup.string().required('Required'),
    "password": Yup.string().required('Required')
})

const loginFormInitialValues={
    username:'',
    password:''
}

export default class Login extends Component {
    constructor(){
        super();
        this.state={
            badLogin:false,
            serverError:false,
            redirect:false,
        };
    };

    handleSubmit= async ({username, password})=>{
        const token = await getToken(username, password)
        if (token ===401){return this.setState({badLogin:true, serverError:false})}
        if (token ===500){return this.setState({badLogin:false, serverError:true})}
        localStorage.setItem('token', token)
        this.props.setToken(token)
        this.setState({redirect:true})
    }
    

    render() {
        const styles={
            error:{color:'red'}
        }


        return (
            <div>                                          
                {this.state.redirect ? <Navigate  to={{pathname:"/", props:{token:localStorage.getItem("token")} }}/>:''}
                <Formik 
                    initialValues={loginFormInitialValues}
                    validationSchema={loginFormSchema}
                    onSubmit={(values)=>{console.log(values); this.handleSubmit(values)}}
                    >
                {({errors, touched})=>(
                    <Form>
                        <label htmlFor="username" className="form-label">username</label>
                        <Field name="username" className="form-control"/>
                        {errors.username && touched.username ? (<div style={styles.error}>{errors.username}</div>):null}

                        <label htmlFor="password" className="form-label">Password</label>
                        <Field name="password" className="form-control" type="password"/>
                        {errors.password && touched.password ? (<div style={styles.error}>{errors.password}</div>):null}

                        {this.state.badLogin?<small style={styles.error}>Invalid Username/Password combo</small>:''}
                        {this.state.serverError?<small style={styles.error}>Unexpected error please Try again</small>:''}
                        <br/>
                        <Button type="submit">Login</Button>
                    </Form>
                )}
                </Formik>
            </div>
        )
    };
}