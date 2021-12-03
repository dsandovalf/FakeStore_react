import React, { Component } from 'react'
import {Col, Row, Button} from 'react-bootstrap'
import {getItems, getItemsByCat} from '../api/apiItems'
import {getCategories} from '../api/apiCategory'
import ItemCard from '../components/ItemCard'

export default class Home extends Component {
    constructor() {
        super();
        this.state={
            categories:[],
            items:[],
            serverErrorCats:false,
            serverErrorItems:false,
            tokenError:false,
            itemStart: 0,
            itemEnd:5
        };
    };

    componentDidMount() {
        //do API calls to get all Cats and Get All items
        this.getAllCats()
    }

    getAllCats = async () =>{
        const cats = await getCategories(localStorage.getItem('token'))
        if(cats===400){this.setState({tokenError:true})}
        if(cats===500){this.setState({serverErrorCats:true})}
        if (cats !==500 && cats !==400){this.setState({categories:cats})}
    }

    handleCat = async (id) =>{
        if (id===0){
            return await this.getAllItems()
        }
        return await this.getCatsItems(id)
        
    }

    getCatsItems=async(id)=>{
        const items = await getItemsByCat(localStorage.getItem('token'),id)
        if(items===400){this.setState({tokenError:true})}
        if(items===500){this.setState({serverErrorItems:true})}
        if (items !==500 && items !==400){this.setState({items, itemStart:0, itemEnd:5})}
    }

    getAllItems=async () =>{
        const items = await getItems(localStorage.getItem('token'))
        if(items===400){this.setState({tokenError:true})}
        if(items===500){this.setState({serverErrorItems:true})}
        if (items !==500 && items !==400){this.setState({items, itemStart:0, itemEnd:5})}
    }

    handlePrev=()=>{
        const oldStart=this.state.itemStart
        const oldEnd=this.state.itemEnd
        this.setState({itemStart:oldStart-5, itemEnd:oldEnd-5})
    }

    handleNext=()=>{
        const oldStart=this.state.itemStart
        const oldEnd=this.state.itemEnd
        this.setState({itemStart:oldStart+5, itemEnd:oldEnd+5})
    }



    render() {
        const styles = {
            catButton:{
                backgroundColor: "white",
                color:"black",
                width: '100%',
                border: '1px solid grey',
                borderRadius: '15px',
                marginBottom:'5px'
            }
        }

        return (
            <div>
                <Row>
                    <Col md={3}>
                        {/* category section */}
                        <center><h3>Categories</h3></center>
                        <hr/>
                        <ul style={{listStyleType:'none'}}>
                            {/* Come back to here */}
                            <li>
                                <button style={styles.catButton} onClick={()=>this.handleCat(0)}>All Items</button>
                            </li>
                            {this.state.categories.map(
                                (cname)=><li key={this.state.categories.indexOf(cname)}>
                                <button style={styles.catButton} onClick={()=>this.handleCat(this.state.categories.indexOf(cname))}>{cname}</button>
                            </li>
                            )}

                        </ul>
                    </Col>
                    <Col md={9}>
                        {/* item section */}
                        <Row>
                            {this.state.items.slice(this.state.itemStart,this.state.itemEnd)
                                .map((i)=><ItemCard addToCart={this.props.addToCart} item={i} key={i.id}/>)}
                        </Row>
                        <div className="d-flex justify-content-center">
                            <Button variant="danger" className={"me-2 " + (this.state.itemStart===0?"disabled":'')} onClick={()=>this.handlePrev()}>{"<< Prev"}</Button>
                            <Button variant="success" className={" " + (this.state.items?.length<=this.state.itemEnd?"disabled":'')} onClick={()=>this.handleNext()}>{"Next >>"}</Button>
                        </div>
                    </Col>
                    
                </Row>
            </div>
        )
    }
}