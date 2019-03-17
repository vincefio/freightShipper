import React, { Component } from 'react'
import firebase from 'firebase'
import M from 'materialize-css'
import { Redirect } from 'react-router'

export default class Listings extends Component {
  constructor(props){
    super(props)
    console.log(this.props.user.uid)
    this.state = {
      orders: [],
      orderIds: [],
      userUid: this.props.user.uid,
      currentId: null,
      redirect: false,
    }
  }

  componentDidMount = () => {

    var elems = document.querySelectorAll('.modal');
    M.Modal.init(elems, {});
    //find all listings from the orders table
    //sort all without the userUid of the current user this.props.user.uid, this will happen locally/
    var db = firebase.firestore()

    db.collection("orders").get().then((querySnapshot) => {
      querySnapshot.forEach(doc => {
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
          
          if(doc.data().userUid !== this.state.userUid && doc.data().deliverCompany === null){
            this.setState(prevState => ({
              orders: [...prevState.orders, doc.data()],
              orderIds: [...prevState.orderIds, doc.id]
            }))
          }
      });
      //console.log(this.state)    
  });
  
  }

  handleSubmit = (event) => {
    event.preventDefault()
    //console.log('submit hit ' + event.target.name)
    console.log(this.state.orders[this.state.currentId])
    //this.state.orderIds[this.state.currentId]

    //add this listing to the delivery collection, or update orders document with delivery company
    //delete this order from the orders table
    //delete this order from the current state
    var db = firebase.firestore()
    
    var thisOrder = this.state.orderIds[this.state.currentId]
    console.log(thisOrder)
    var currentOrder = db.collection("orders").doc(`${thisOrder}`);

    // Set the "capital" field of the city 'DC'
    return currentOrder.update({
        deliverCompany: this.props.user.uid,
    })
    .then(() => {
        console.log("Document successfully updated!");

        //redirect to dashboard
        this.setState({
          redirect: true
        })
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
  }

  handleChange = (event) => {
    console.log('handle change ' + event.target.name)
    this.setState({
      currentId: event.target.name,
    })
  }

  render() {
    
    //console.log(this.props.user.userUid)
    const orders = this.state.orders
    // .filter((order) => 
    //   order.userUid !== this.state.userUid && order.deliverCompany !== null
    // )
    .map((order, i) => 
      <li className="orderWrapper" name={i} key={i}>
      <h5 class="">PickUp Date: {order.pickUpDate}</h5>
      <div>Origin: {order.city}, {order.state}</div>
      <div>Destination: {order.receiverCity}, {order.receiverState}</div>
      <button name={i} onClick={this.handleChange} className="btn modal-trigger deliverButton" href="#modal1">Deliver this order</button>
      </li>
    )

    var modal =  
    <div id="modal1" class="modal">
      <div class="modal-content">
        <h4>Confirm this order</h4>
        <p>Are you sure you want to make this delivery?</p>
      </div>
      <div class="modal-footer">
        <a onClick={this.handleSubmit} href="#!" class="modal-close waves-effect waves-green btn-flat">Confirm</a>
      </div>
    </div>

    if(this.state.redirect){
      return <Redirect to="/dashboard" />
    }

    return (
      
      <div className="container">
        <h1>LISTINGS</h1>
        <h3>Bid on orders</h3>
        <ul className="">
        { orders }
        { modal }
        </ul>
      </div>
    )
  }
}
