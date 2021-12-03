import React, { Component } from 'react'
import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';
import {Navigate} from 'react-router-dom';
import {getCategories} from '../api/apiCategory'
import {postItem} from '../api/apiItems'

const FormSchema = Yup.object().shape({
    "title": Yup.string().required("Required"),
    "description": Yup.string(),
    "price":Yup.string().matches(/^\d+(\.\d{1,2})?$/,"Must be a Valid Price").required("Required"),
    "imgURL":Yup.string(),
    "category":Yup.string()
})

const initialValues = {
    name:'',
    description:'',
    price:'',
    img:'',
    category:''
}

export default class CreateItems extends Component {
    constructor() {
        super();
        this.state={
            tokenError:false,
            serverErrorCats:false,
            categories:[],
            unsuccessfulPost: false,
            succussfulPost:false
        }
    }

    componentDidMount(){
        this.getAllCats()
    }

    handleSubmit=async (values)=>{
        const res = await postItem(localStorage.getItem('token'),values)
        if (res){
            this.setState({successfulPost:true})
        }else{
            this.setState({unsuccessfulPost:true})
        }
    }

    getAllCats = async () =>{
        const cats = await getCategories(localStorage.getItem('token'))
        if(cats===400){this.setState({tokenError:true})}
        if(cats===500){this.setState({serverErrorCats:true})}
        if (cats !==500 && cats !==400){this.setState({categories:cats})}
    }

    render() {
        return (
            <div>
            {this.state.successfulPost?<small style={{color:"green"}}>Your Item Was Created</small>:""}
            {this.state.unsuccessfulPost?<small style={{color:"red"}}>Error Creating Item, Please Try again</small>:""}
            {this.state.serverErrorCats?<small style={{color:"red"}}>Error try again later</small>:''}
            {this.state.tokenError?<Navigate to='/login'/>:''}       


                <br/>
                <Formik
                initialValues={initialValues}
                validationSchema={FormSchema}
                onSubmit={
                    (values, {resetForm}) => {
                        this.handleSubmit(values);
                        resetForm(initialValues)
                    }
                }
                >
                    {
                        ({errors, touched})=>(
                            <Form>
                                <label htmlFor="name" className="form-label">Item Name</label>
                                <Field name="name" className="form-control"/>
                                {errors.name && touched.name ? (<div style={{color:'red'}}>{errors.name}</div>):null}

                                <label htmlFor="description" className="form-label">Description</label>
                                <Field name="description" className="form-control"/>
                                {errors.description && touched.description ? (<div style={{color:'red'}}>{errors.description}</div>):null}

                                <label htmlFor="price" className="form-label">Price</label>
                                <Field name="price" className="form-control"/>
                                {errors.price && touched.price ? (<div style={{color:'red'}}>{errors.price}</div>):null}

                                <label htmlFor="img" className="form-label">Image</label>
                                <Field name="img" className="form-control"/>
                                {errors.img && touched.img ? (<div style={{color:'red'}}>{errors.img}</div>):null}

                                <label htmlFor="category" className="form-label">Category</label>
                                <Field as="select" name="category" className="form-select" >
                                    {this.state.categories?.map(
                                        (c)=><option key={this.state.categories.indexOf(c)} value={this.state.categories.indexOf(c)}>{c}</option>
                                    )}
                                </Field>
                                {errors.category && touched.category ? (<div style={{color:'red'}}>{errors.category}</div>):null}
                                <br/>
                                <button className="btn btn-primary form-control" type="submit">Create Item</button>
                            </Form>
                        )
                    }

                </Formik>
            </div>
        )
    }
}