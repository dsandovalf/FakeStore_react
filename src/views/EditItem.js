import React, { Component } from 'react'
import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';
import {Button} from 'react-bootstrap';
import {getCategories} from '../api/apiCategory'
import {putItem, getItems, deleteItem} from '../api/apiItems'
import { Navigate } from 'react-router';

const FormSchema = Yup.object().shape({
    "title": Yup.string().required("Required"),
    "description": Yup.string(),
    "price":Yup.string().matches(/^\d+(\.\d{1,2})?$/,"Must be a Valid Price").required("Required"),
    "imgURL":Yup.string(),
    "category":Yup.string()
})

export default class EditItems extends Component {
    constructor() {
        super();
        this.state={
            tokenError:false,
            serverErrorCats:false,
            categories:[],
            items:[],
            item:{},
            unsuccessfulPost: false,
            successfulPost: false,
            unsuccessfulDelete: false,
            successfulDelete: false,
            serverErrorItem:false
        }
    }

    componentDidMount(){
        this.getAllCats()
        this.getAllItems()
    }

    getAllCats = async () =>{
        const cats = await getCategories(localStorage.getItem('token'))
        if(cats===400){this.setState({tokenError:true,serverErrorCats:false})}
        if(cats===500){this.setState({serverErrorCats:true,tokenError:false})}
        if (cats !==500 && cats !==400){this.setState({categories:cats})}
    }

    getAllItems=async()=>{
        const items=await getItems(localStorage.getItem('token'))
        if(items===400){this.setState({tokenError:true,serverErrorItem:false})}
        if(items===500){this.setState({serverErrorItem:true,tokenError:false})}
        if (items !==500 || items !== 400){
            this.setState({items})
        }
    }

    handlePullDown=(event)=>{
        const newId = event.target.value;
        if (newId===0){return}
        const newitem = this.state.items.filter((i)=>i.id===parseInt(newId))[0];
        this.setState({item:newitem})
    }

    handleDeleteItem=async()=>{
        if (window.confirm(`Are you sure you want to delete ${this.state.item.name}`)){
            const res= await deleteItem(localStorage.getItem('token'), this.state.item.id, )
            if (res) {
                this.setState({succesfulDelete:true, unsuccessfulDelete:false}); 
                this.getAllItems();
            }else{
                this.setState({succesfulDelete:false, unsuccessfulDelete:true}); 

            }
        }
    }

    handleSubmit=async (values)=>{
        console.log(values)
        const res=await putItem(localStorage.getItem('token'), this.state.item.id, values)
        console.log(res)
        if(res){
            this.setState({successfulPost:true})
        }else{
            this.setState({unsuccessfulPost:true})
        }
    }

    render() {
        return (
            <div>
                {this.state.tokenError?<Navigate to='/login'/>:''} 
                <br/>
                <label htmlFor="itemsList" className="form-label">Choose Item to Edit</label>
                <select id="options" name="itemsList" className="form-select form-select-lg mb-3" onChange={(event)=>this.handlePullDown(event)}>
                    <option defaultValue={0} label="--Choose an item--"/>
                    {this.state.items?.map(
                        (item)=><option key={this.state.items.indexOf(item)} value={this.state.items.indexOf(item)} label={this.state.items.indexOf(item)}/>
                    )}
                </select>
                {Object.entries(this.state.items??{}).length>0
                    ?
                    <>
                    <br/>
                    <hr/>
                    <h2>{this.state.items?.name??"No Item Name"}</h2>
                    <Button variant="danger" onClick={()=>this.handleDeleteItem()}>Delete Item</Button>
                    <hr/>
                    <br/>
                    <Formik
                        initialValues={
                            {
                                name:this.state.item?.name ?? '',
                                description:this.state.item?.description ?? '',
                                price:this.state.item?.price ?? '',
                                img:this.state.item?.img ?? '',
                                category: this.state.item?.category ?? ''
                            }
                        }
                        enableReinitialize
                        validationSchema={FormSchema}
                        onSubmit={
                            (values,{resetForm})=>{
                                console.log(values);
                                this.handleSubmit(values);
                                resetForm({
                                    name:'',
                                    description:'',
                                    img:'',
                                    price:'',
                                    category:''
                            });
                            }
                        }>
                        {({ errors, touched })=>(
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

                                <button className="btn btn-primary form-control" type="submit">Edit Item</button>   
                            </Form>
                        )
                        }

                    </Formik>
                    </>
                :''}

            </div>
        )
    }
}