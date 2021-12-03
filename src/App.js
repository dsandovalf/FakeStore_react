import React, { Component } from 'react';
import {Routes, Route} from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import NavBar from './components/NavBar';
import Login from './views/Login';
import Logout from './views/Logout';
import Shop from './views/Shop';
import Cart from './views/Cart';
import CreateItem from './views/CreateItem';
import EditItem from './views/EditItem';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class App extends Component {

  constructor(){
    super();
    this.state={
      user:'',
      token:'',
      cart:[],
      cartTotal:0,
      itemToEdit:{},
      isAdmin: true
    };
  }
  
  setUser = (user) =>{
    this.setState({user});
  }

  setToken = (token) =>{
      this.setState({token})
      localStorage.setItem('token',token)
  }

  static getDerivedStateFromProps = (props,state)=>{
    return {"token":localStorage.getItem('token')}
  }

  addToCart=(item)=>{
    let cart = this.state.cart
    if (cart[item.name]){
      cart[item.name].quantity++
    }else{
      cart[item.name]={...item,quantity:1}
    }
    this.setState({cart})
    localStorage.setItem("cart",JSON.stringify(cart))
    alert(`Thanks for adding ${item.name} to your cart`)
  }
  
  //The total number of items in the cart
  getCartItemTotal=()=>{
    let total=0
    for (const item in this.state.cart){
      total+=this.state.cart[item].quantity
    }
    return total
  }

  // the total price of all items in cart
  getCartTotalPrice=()=>{
    let total=0
    for (const item in this.state.cart){
      total+=this.state.cart[item].quantity*this.state.cart[item].price
    }
    return total
  }

  removeFromCart = (item)=>{
    let cart=this.state.cart;
    if (cart[item.name].quantity >1){
      cart[item.name].quantity--
    }else if (cart[item.name].quantity === 1){
      delete cart[item.name]
    }
    this.setState({cart})
    localStorage.setItem("cart",JSON.stringify(cart))
    alert(`You remove ${item.name} from your cart`)
  }

  removeAllFromCart=(item)=>{
    let cart=this.state.cart;
    if(cart[item.name]){
      delete cart[item.name];
    }
    this.setState({cart})
    localStorage.setItem("cart",JSON.stringify(cart))
    alert(`You remove all of ${item.name}s from your cart`)
  }

  clearCart=()=>{
    this.setState({cart:{}})
    localStorage.removeItem("cart")
  }

  render() {
    return (
      <div>
        <NavBar token={this.state.token} isAdmin={this.state.isAdmin} getCartTotalPrice={this.getCartTotalPrice} getCartItemTotal={this.getCartItemTotal} />
        <Routes>

          <Route exact path='/' element={
            <ProtectedRoute token={this.state.token}>
              <Shop token={this.state.token} setToken={this.setToken} addToCart={this.addToCart} isAdmin={this.state.isAdmin}/>
            </ProtectedRoute>
          }/>

          <Route path = '/cart' element={
            <ProtectedRoute token={this.state.token}>
              <Cart 
                            cart={this.state.cart} 
                            removeFromCart={this.removeFromCart} 
                            removeAllFromCart={this.removeAllFromCart}
                            getCartItemTotal={this.getCartItemTotal}
                            getCartTotalPrice={this.getCartTotalPrice}
                            />       
              </ProtectedRoute>
          }/>   

          <Route path = '/createitem' element={
            <ProtectedRoute token={this.state.token}>
            <CreateItem/>
            </ProtectedRoute>
          }/>

          <Route path = '/edititem' element={
            <ProtectedRoute token={this.state.token}>
            <EditItem/>
            </ProtectedRoute>
          }/>

          <Route path = '/logout' element={
            <ProtectedRoute token={this.state.token}>
              <Logout setToken={this.setToken}/>
            </ProtectedRoute>
          }/>

          <Route path = '/login' element={
            <Login setToken={this.setToken} token={this.state.token} setName={this.setName}/>
          }/>
        </Routes>
      </div>
    );
  }
}