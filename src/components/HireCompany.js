import React, { Component } from 'react'
import { Redirect } from 'react-router'
import firebase from 'firebase'
import axios from 'axios'

const dateRegex = RegExp(/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/)

const formValid = formErrors => {
  let valid = true;
  console.log('form valid hit')
  Object.values(formErrors).forEach(val => {
    //val.length > 0 && (valid = false);
    if(val.length > 0){
      console.log('we have an error')
      valid = false;
    }
    
  })

  return valid;
}


export default class HireCompany extends Component {
  constructor(props){
    super(props)
      this.state = {
        userUid: this.props.user.uid,
        pickUpDate: '',
        myCompanyName: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        email: '',
        receiverCompanyName: '',
        receiverAddress: '',
        receiverCity: '',
        receiverState: '',
        receiverZip: '',
        receiverPhone: '',
        specialInstructions: '',
        sendResult: true,
        formErrors: {
          pickUpDate: '',
          myCompanyName: '',
          address: '',
          city: '',
          state: '',
          zip: '',
          phone: '',
          email: '',
          receiverCompanyName: '',
          receiverAddress: '',
          receiverCity: '',
          receiverState: '',
          receiverZip: '',
          receiverPhone: '',
          specialInstructions: '',
        },
        redirect: false,
        costPerMile: '',
      }

      this.handleChange = this.handleChange.bind(this)
      this.writeHireData = this.writeHireData.bind(this)
  }

  handleChange(event){
    this.setState({
      [event.target.name]: event.target.value
    })
   //console.log(this.state)
   const { name, value } = event.target;
   let formErrors = this.state.formErrors;

   //console.log('name ' + name + ' value ' + value)

   switch(name){
     case 'pickUpDate':
        //console.log(value)
        //console.log(dateRegex.test(value))
        formErrors.pickUpDate = dateRegex.test(value) ? '' : 'Please add a valid pickup date mm/dd/yyyy';
      break;
    case 'myCompanyName':
      formErrors.myCompanyName = value.length < 3 ? 'Please add a valid company name' : '';
      break;
    case 'address':
      formErrors.address = value.length < 3 ? 'Please add a valid address' : '';
      break;
    case 'city':
      formErrors.city = value.length < 3 ? 'Please add a valid city' : '';
      break;
    case 'state':
      formErrors.state = value.length < 2 ? 'Please add a valid state' : '';
      break;
    case 'zip':
      formErrors.zip = value.length < 3 ? 'Please add a valid zip' : '';
      break;
    case 'phone':
      formErrors.phone = value.length < 3 ? 'Please add a valid phone number' : '';
      break;
    case 'email':
      formErrors.email = value.length < 3 ? 'Please add a valid email' : '';
      break;
    case 'receiverCompanyName':
      formErrors.receiverCompanyName = value.length < 3 ? 'Please add a valid company name' : '';
      break;
    case 'receiverAddress':
      formErrors.receiverAddress = value.length < 3 ? 'Please add a valid company name' : '';
      break;
    case 'receiverCity':
      formErrors.receiverCity = value.length < 3 ? 'Please add a valid city name' : '';
      break;
    case 'receiverState':
      formErrors.receiverState = value.length < 2 ? 'Please add a valid state name' : '';
      break; 
    case 'receiverZip':
      formErrors.receiverZip = value.length < 3 ? 'Please add a valid zip code' : '';
      break;   
    case 'receiverPhone':
      formErrors.receiverPhone = value.length < 3 ? 'Please add a valid phone number' : '';
    break;
    
    default:
      break;
   }

   this.setState({ formErrors, [name]: value })

  }

//handle submit
  handleSubmit = e => {
    e.preventDefault();

    if(formValid(this.state.formErrors)){
      console.log('submitting form')

      //create an object from state/
      //const stateMinusErrors = this.state
      //delete stateMinusErrors.formErrors


      this.writeHireData(this.state.userUid, this.state.pickUpDate, this.state.myCompanyName, this.state.address, this.state.city, this.state.state,
        this.state.zip, this.state.receiverCompanyName, this.state.receiverAddress, this.state.receiverCity,
        this.state.receiverState, this.state.receiverZip, this.state.specialInstructions)

      //console.log(stateMinusErrors)
    }else{
      console.log('form invalid')
      this.setState({
        sendResult: false,
      })
    }
  }

  writeHireData = async (uid, pickUpDate, myCompanyName, address, city, state, zip,
    receiverCompanyName, receiverAddress, receiverCity, receiverState, receiverZip, specialInstructions) => {


    //console.log(this.props.user.uid)
    console.log(pickUpDate)
    var order = {
      userUid: uid,
      pickUpDate,
      myCompanyName,
      address,
      city,
      state,
      zip,
      receiverCompanyName,
      receiverAddress,
      receiverCity,
      receiverState,
      receiverZip,
      specialInstructions,
      deliverCompany: null,
    }

    console.log('ORDER ' + JSON.stringify(order))
    
    //order object
    //this order needs to be saved in the orders table, so it can be seen by other companies
    //also needs to have reference, or i can just name the document the title of the company, or user id

    var database = firebase.firestore();
    //user id is
  database.collection('orders').doc().set(order)
    .then((docRef) => {
      //console.log("Document written with ID: ", docRef.id);
      console.log('doc saved to db')
      
      //redirect to dashboard page
      this.setState({
        redirect: true,
      })
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
  }



  render() {
    const { formErrors } = this.state;

    if(this.state.redirect){
      return <Redirect to="/dashboard" />
    }

    var resultText;
    if (!this.state.sendResult) {
      resultText = <h5 className="errorMessage">Please fill out all fields</h5>;
    }

    return (
      <div className="container">

       
<form onSubmit={this.handleSubmit} className="hireFormContainer">
      <div>
        <h3>My Information</h3>
          <label for="pickUpDate">Pick Up Date (mm/dd/yyyy)</label>
          <input onChange={this.handleChange} name="pickUpDate" id="pickUpDate" className="" type="text"></input>
          {formErrors.pickUpDate.length > 0 && (
            <span className="errorMessage" data-error="wrong" data-success="right">{formErrors.pickUpDate}</span>
          )}
          <label for="myCompanyName">Company Name</label>
          <input onChange={this.handleChange} name="myCompanyName" id="myCompanyName" className="formInput" type="text"></input>
          {formErrors.myCompanyName.length > 0 && (
            <span className="errorMessage" data-error="wrong" data-success="right">{formErrors.myCompanyName}</span>
          )}
          <label for="address">Address</label>
          <input onChange={this.handleChange} name="address" id="address" className="formInput" type="text"></input>
          {formErrors.address.length > 0 && (
            <span className="errorMessage" data-error="wrong" data-success="right">{formErrors.address}</span>
          )}
          <label for="city">City</label>
          <input onChange={this.handleChange} name="city" id="city" className="formInput" type="text"></input>
          {formErrors.city.length > 0 && (
            <span className="errorMessage" data-error="wrong" data-success="right">{formErrors.city}</span>
          )}
          <label for="state">State</label>
          <input onChange={this.handleChange} name="state" id="state" className="formInput" type="text"></input>
          {formErrors.state.length > 0 && (
            <span className="errorMessage" data-error="wrong" data-success="right">{formErrors.state}</span>
          )}
          <label for="zip">Zip</label>
          <input onChange={this.handleChange} name="zip" id="zip" className="formInput" type="text"></input>
          {formErrors.zip.length > 0 && (
            <span className="errorMessage" data-error="wrong" data-success="right">{formErrors.zip}</span>
          )}
          {/* <label for="phone">Phone</label>
          <input onChange={this.handleChange} name="phone" id="phone" className="formInput" type="text"></input>
          {formErrors.phone.length > 0 && (
            <span className="errorMessage" data-error="wrong" data-success="right">{formErrors.phone}</span>
          )}
          <label for="email">Email</label>
          <input onChange={this.handleChange} name="email" id="email" className="formInput" type="text"></input>
          {formErrors.email.length > 0 && (
            <span className="errorMessage" data-error="wrong" data-success="right">{formErrors.email}</span>
          )} */}
          </div>

          <div>
        <h3>Receiver Information</h3>
          <label for="receiverCompanyName">Company Name</label>
          <input onChange={this.handleChange} name="receiverCompanyName" id="receiverCompanyName" className="formInput" type="text"></input>
          {formErrors.receiverCompanyName.length > 0 && (
            <span className="errorMessage" data-error="wrong" data-success="right">{formErrors.receiverCompanyName}</span>
          )}
          <label for="receiverAddress">Address</label>
          <input onChange={this.handleChange} name="receiverAddress" id="receiverAddress" className="formInput" type="text"></input>
          {formErrors.receiverAddress.length > 0 && (
            <span className="errorMessage" data-error="wrong" data-success="right">{formErrors.receiverAddress}</span>
          )}
          <label for="receiverCity">City</label>
          <input onChange={this.handleChange} name="receiverCity" id="receiverCity" className="formInput" type="text"></input>
          {formErrors.receiverCity.length > 0 && (
            <span className="errorMessage" data-error="wrong" data-success="right">{formErrors.receiverCity}</span>
          )}
          <label for="receiverState">State</label>
          <input onChange={this.handleChange} name="receiverState" id="receiverState" className="formInput" type="text"></input>
          {formErrors.receiverCity.length > 0 && (
            <span className="errorMessage" data-error="wrong" data-success="right">{formErrors.receiverCity}</span>
          )}
          <label for="receiverZip">Zip</label>
          <input onChange={this.handleChange} name="receiverZip" id="receiverZip" className="formInput" type="text"></input>
          {formErrors.receiverZip.length > 0 && (
            <span className="errorMessage" data-error="wrong" data-success="right">{formErrors.receiverZip}</span>
          )}
          {/* <label for="receiverPhone">Phone</label>
          <input onChange={this.handleChange} name="receiverPhone" id="receiverPhone" className="formInput" type="text"></input>
          {formErrors.receiverPhone.length > 0 && (
            <span className="errorMessage" data-error="wrong" data-success="right">{formErrors.receiverPhone}</span>
          )} */}

          </div>

          <div>
            <h4>Extra Services</h4>
          <p>
            <label>
              <input type="checkbox" />
              <span>Hazmat</span>
            </label>
          </p>
          <p>
            <label>
              <input type="checkbox"/>
              <span>Residential Delivery</span>
            </label>
          </p>
          <p>
            <label>
              <input type="checkbox"/>
              <span>Lift Gate At Delivery</span>
            </label>
          </p>
          </div>

          <div>

          <h4>Special Instructions</h4>

          <textarea onChange={this.handleChange} name="specialInstructions" id="specialInstructions" className="formInput" type="text"></textarea>
          {
            resultText
          }
          <button className="btn">Submit</button>

          </div>
          
          
        </form>



      </div>
    )
  }
}
