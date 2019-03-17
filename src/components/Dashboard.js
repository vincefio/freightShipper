import React, { Component } from 'react'
import firebase from 'firebase'
import M from 'materialize-css'

var database = firebase.firestore();

export default class Dashboard extends Component {
  constructor(props){
    super(props)
    this.state = {
      myOrders: [],
      myOrderIds: [],
      myDeliveries: [],
      myDeliveryIds: [],
      currentId: null,
      deliveryOrPickup: null,
      currentDocumentId: null,
    }
  }

  componentDidMount(){
    var elems = document.querySelectorAll('.collapsible');
    M.Collapsible.init(elems, {});

    var elems = document.querySelectorAll('.modal');
    M.Modal.init(elems, {});
    //get current orders from db

    console.log(this.props.user.uid)
    //var docRef = database.collection('orders').doc(this.props.user.uid);

    database.collection("orders").where("userUid", "==", this.props.user.uid)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            var data = doc.data()

            this.setState(prevState => ({
              myOrders: [...prevState.myOrders, data],
              myOrderIds: [...prevState.myOrderIds, doc.id]
            }))
            //console.log('state ' + JSON.stringify(this.state))
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

    //get the deliveries
    database.collection("orders").where("deliverCompany", "==", this.props.user.uid)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            var data = doc.data()

            this.setState(prevState => ({
              myDeliveries: [...prevState.myDeliveries, data],
              myDeliveryIds: [...prevState.myDeliveryIds, doc.id]
            }))
            //console.log('state ' + JSON.stringify(this.state))
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
  }

  handleChangePickup = (event) => {
    console.log('handle change pickup' + parseInt(event.target.name))
    this.setState({
      currentId: event.target.name,
      deliveryOrPickup: 'pickup'
    })
  }

  handleChangeDelivery = (event) => {
    console.log('handle change delivery' + parseInt(event.target.name))
    this.setState({
      currentId: event.target.name,
      deliveryOrPickup: 'delivery'
    })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    console.log('submit hit ' + event.target.name)


    await this.deliveryOrPickup()
    //delete order
    await this.deleteOrder()
  }

  deliveryOrPickup = () => {
    //console.log('delivery or pickup')
    if(this.state.deliveryOrPickup == 'pickup'){
      console.log('pickup')
      var newOrders = [...this.state.myOrders]
      newOrders.splice(this.state.currentId, 1)
      var newIds = [...this.state.myOrderIds]
      newIds.splice(this.state.currentId, 1)
      this.setState(prevState => ({
        myOrders: newOrders,
        myOrderIds: newIds,
        currentDocumentId: this.state.myDeliveryIds[this.state.currentId]
      }))

    }else{
      console.log('delivery')
      var newDeliveries = [...this.state.myDeliveries]
      newDeliveries.splice(this.state.currentId, 1)
      var newDeliveryIds = [...this.state.myDeliveryIds]
      newDeliveryIds.splice(this.state.currentId, 1)
      this.setState(prevState => ({
        myDeliveries: newDeliveries,
        myDeliveryIds: newDeliveryIds,
        currentDocumentId: this.state.myOrderIds[this.state.currentId]
      }))
    }
  }

  deleteOrder = () => {
      var thisOrder = this.state.currentDocumentId
      console.log(thisOrder)
        //delete this order document from db
        database.collection("orders").doc(`${thisOrder}`).delete().then(function() {
          console.log("Document successfully deleted!");
        }).catch(function(error) {
          console.error("Error removing document: ", error);
        }); 
  }

  render() {
    const myOrders = this.state.myOrders.map((order, i) => 
      <li key={order.receiverCompanyName}>
      <div class="collapsible-header">PickUp Date: {order.pickUpDate}</div>
      <div class="collapsible-body">
      <div>{order.myCompanyName + ' to ' + order.receiverCompanyName}</div>
      <button name={i} onClick={this.handleChangePickup} className="btn modal-trigger deliverButton" href="#modal1">Mark complete</button>
      </div>
    </li>
    )

    const myDeliveries = this.state.myDeliveries.map((order, i) => 
      <li key={order.receiverCompanyName}>
      <div class="collapsible-header">Delivery Date: {order.pickUpDate}</div>
      <div class="collapsible-body">
      <div>{'Pickup from ' + order.address + ' ' + order.city + ', ' + order.state}</div>
      <div>{'Deliver to ' + order.receiverAddress + ' ' + order.receiverCity + ', ' + order.receiverState}</div>
      <button name={i} onClick={this.handleChangeDelivery} className="btn modal-trigger deliverButton" href="#modal1">Mark order complete</button>
      </div>
    </li>
    )

    var modal =  
    <div id="modal1" class="modal">
      <div class="modal-content">
        <h4>Confirm this order</h4>
        <p>Are you sure you want to mark this order complete?</p>
      </div>
      <div class="modal-footer">
        <a onClick={this.handleSubmit} href="#!" class="modal-close waves-effect waves-green btn-flat">Confirm</a>
      </div>
    </div>

    return (
      <div className="container">
        <h1>DASHBOARD</h1>
        <h3>My Pickups</h3><span>Click to expand</span>
        <ul className="collapsible">
          { myOrders }
        </ul>

        <h3>Deliveries</h3><span>Click to expand</span>
        <ul className="collapsible">
          { myDeliveries }
         
        </ul>

        { modal }

      </div>
    )
  }
}
