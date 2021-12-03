import React, {useState, useEffect} from 'react';
import {Table, Button} from "react-bootstrap";
import {postTransaction} from "../api/apiCheckout";
      
    const Message = ({ message }) => (
    <section>
        <p>{message}</p>
    </section>
    );
    
    export default function Cart(props) {
        const [message, setMessage] = useState("");     
        useEffect(() => {
            // Check to see if this is a redirect back from Checkout
            const query = new URLSearchParams(window.location.search);
            
            if (query.get("success")) {
                setMessage("Order placed! You will receive an email confirmation.");
            }
            
            if (query.get("canceled")) {
                setMessage(
                    "Order canceled -- continue to shop around and checkout when you're ready."
                    );
                }
            }, []);

            const handleCheckout=async ()=>{
                await postTransaction(localStorage.getItem("token"),{cart:props.cart})
            }

        

        return  message ? (
            <Message message={message} />
            ) : (
        <div>
            {Object.keys(props.cart).length>0 ? 
            (<>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Quanity</th>
                        <th>Remove One</th>
                        <th>Remove All</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.keys(props.cart).map(
                            (key)=>(
                                <tr key={props.cart[key].id}>
                                    <td>{props.cart[key].id}</td>
                                    <td>
                                        <img 
                                        alt = "The Item"
                                        style={{height:"100px", objectFit:"contain"}}
                                        src={props.cart[key].img ?? "https://res.cloudinary.com/cae67/image/upload/v1629310111/fakebook_shop/no-image_nkau78.png"}
                                        />
                                    </td>
                                    <td>{props.cart[key].name ?? "No Name"}</td>
                                    <td>{props.cart[key].description ?? "No Description"}</td>
                                    <td>${props.cart[key].price.toFixed(2) ?? "No Price"}</td>
                                    <td>{props.cart[key].quantity ?? "0"}</td>
                                    <td>
                                        <Button 
                                            variant="warning"
                                            onClick={()=>props.removeFromCart(props.cart[key])}
                                            >
                                                Remove One
                                        </Button>

                                    </td>
                                    <td>
                                    <Button 
                                            variant="danger"
                                            onClick={()=>props.removeAllFromCart(props.cart[key])}
                                            >
                                                Remove All
                                        </Button>

                                    </td>
                                    
                                </tr>
                            )
                        )
                    }
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>

                        <td>${props.getCartTotalPrice().toFixed(2)}</td>
                        <td>{props.getCartItemTotal()}</td>

                        <td></td>
                        <td></td>
                    </tr>

                </tbody>
            </Table>
            <Button onClick={handleCheckout} className="float-end">
                Checkout
            </Button>
            </>):(
                <h2>Your Cart is Empty</h2>
            )
        }
        </div>
    )
}