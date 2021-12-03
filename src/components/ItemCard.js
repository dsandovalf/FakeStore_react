import React, { Component } from 'react'
import { Card, Col, Button } from 'react-bootstrap';

export default class ItemCard extends Component {

    constructor() {
        super();
        this.state={
            clicked:false
        };
    }

    handleRenderItem=()=>{
        this.setState({clicked:true})
    }

    handleAddTocart=(item)=>{
        this.props.addToCart(item)
    }

    render() {
        return (
            <Col>
            {/* come back for single item */}
                <Card style={{ width: '200px', marginBottom:"55px" }}>
                <Card.Subtitle className="float-start">- {this.props.item.category ?? 'category none'} </Card.Subtitle>
                <br/>
                <Card.Img variant="top" style={{height:"100px", objectFit:"contain"}} alt={this.props.item.title+" photo"}
                    src={this.props.item.image ?? 'https://res.cloudinary.com/cae67/image/upload/v1629310111/fakebook_shop/no-image_nkau78.png' } />
                <Card.Body>
                    <Card.Title>{this.props.item.title ?? "Generic Item"}</Card.Title>
                    <Card.Text>
                    {this.props.item.description ?? "Sorry No Description"}
                    </Card.Text>
                    <Card.Subtitle className="float-end">${this.props.item.price ?? '?.??'} </Card.Subtitle>
                    <br/>
                   
                    <Button variant="primary" className="float-end" onClick={()=>this.props.addToCart(this.props.item)}>Add to cart</Button>
                </Card.Body>
                </Card>
            </Col>
        )
    }
}