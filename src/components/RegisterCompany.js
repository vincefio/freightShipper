import React, { Component } from 'react'
import firebase from 'firebase'
import Company from '../classes/companyClass'
import { Redirect } from 'react-router'

const formValid = formErrors => {
  let valid = true;
  //console.log('form valid hit')
  Object.values(formErrors).forEach(val => {
    //val.length > 0 && (valid = false);
    if(val.length > 0){
      console.log('we have an error')
      valid = false;
    }
    
  })

  return valid;
}


export default class RegisterCompany extends Component {
  constructor(props){
    
    super(props)
    this.state = {
      user: false,
      name: '',
      registerCompanyName: '',
      registerCompanyAddress: '',
      registerCompanyCity: '',
      registerCompanyState: '',
      registerCompanyZip: '',
      deliveryTrucks: null,
      numberOfTrucks: 0,
      costPerMile: 0,
      redirect: false,
      formErrors: {
        registerCompanyName: '',
        registerCompanyAddress: '',
        registerCompanyCity: '',
        registerCompanyState: '',
        registerCompanyZip: '',
        costPerMile: '',
      }
    }
  }

  componentDidMount(props){
     // Get a reference to the database service
    var database = firebase.firestore();
    //check firebase to see if there is a company with name of this.props.user.uid
    console.log(this.props.user.uid)
    var docRef = database.collection("companies").doc(this.props.user.uid);

    docRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            console.log("Document data:", doc.data().name);
          
            this.setState({
              user: true,
              name: doc.data().name,
            })
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

    //console.log(this.props.user.uid)
  }

  handleChange = (event) => {
    //console.log(event.target.value)
    this.setState({
      [event.target.name]: event.target.value
    })

    //validate inputs
    const { name, value } = event.target
    let { formErrors } = this.state

    switch(name){
      case 'registerCompanyName':
        formErrors.registerCompanyName = value.length < 3 ? 'Please add a valid company name' : '';
        break;
      case 'registerCompanyAddress':
        formErrors.registerCompanyAddress = value.length < 3 ? 'Please add a valid company address' : '';
        break;
      case 'registerCompanyName':
        formErrors.registerCompanyCity = value.length < 3 ? 'Please add a valid city name' : '';
        break;
      case 'registerCompanyCity':
        formErrors.registerCompanyCity = value.length < 3 ? 'Please add a valid city' : '';
        break;
      case 'registerCompanyState':
        formErrors.registerCompanyState = value.length < 2 ? 'Please add a valid state' : '';
        break;
      case 'registerCompanyZip':
        formErrors.registerCompanyZip = value.length < 3 ? 'Please add a valid zip' : '';
        break;
      case 'deliveryTrucks':
          //console.log(document.getElementById('deliveryTrucks').checked)
          this.setState({
            [event.target.name]: document.getElementById('deliveryTrucks').checked
          })
        break;
      case 'costPerMile':
          //console.log('input hit')
        var r = /^\$?[0-9]+(\.[0-9][0-9])?$/;
        //console.log(r.test(value));  //true
        formErrors.costPerMile = !r.test(value) ? 'Please add a valid price (check formatting)' : '';
        break;
      case 'updateInfo':
          this.setState({
            user: false,
          })
          break;
      default:
        break;
    }

  } 

  handleSubmit = (event) => {
    event.preventDefault()
    //console.log(this.state)
    const state = this.state
    
    //Validate form
    if(formValid(this.state.formErrors)){
      console.log('submitting form')

      //create new Company obj
      //the company obj is not in use, but i'm happy i learned to use classes in this project
      //my whole level of JS has increased, and understanding more about classes and modules 
      //has increased my understanding of React 
      const company = new Company(this.props.user.uid, state.registerCompanyName, state.registerCompanyAddress, state.registerCompanyCity,
        state.registerCompanyState, state.registerCompanyZip, state.deliveryTrucks, state.numberOfTrucks)

      this.writeUserData(state.registerCompanyName, state.registerCompanyAddress, state.registerCompanyCity,
        state.registerCompanyState, state.registerCompanyZip, state.deliveryTrucks, state.numberOfTrucks, state.costPerMile)


      //console.log(company)///
    }else{
      console.log('form invalid')
    }
  }

  writeUserData = (name, address, city, state, zip, deliveryTrucks, numberOfTrucks, costPerMile) => {
    console.log(this.props.user.uid)
    var company = {
      name: name,
      address: address,
      city: city,
      state: state,
      zip: zip,
      deliveryTrucks: deliveryTrucks,
      numberOfTrucks: numberOfTrucks,
      costPerMile: costPerMile,
    }
    var database = firebase.firestore();

    database.collection('companies').doc(this.props.user.uid).set(company)
    .then((docRef) => {
      //console.log("Document written with ID: ", docRef.id);
      console.log('doc saved to db')

      //redirect to dashboard
      this.setState({
        redirect: true,
      })
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
  }


  render() {
    const { formErrors } = this.state

    if(this.state.redirect){
      return <Redirect to="/dashboard" />
    }

    if(this.state.user){
      console.log(this.props)
        return(
          <div className="container">
            <h2>You are currently registered as {this.state.name}</h2>
            <h3>Would you like to update company information?</h3>
            <label>
              <input onChange={this.handleChange} id="updateInfo" name="updateInfo" type="checkbox" />
              <span>Yes</span>
            </label>
          </div>
        )
    }
    else{
    return (

      <div className="container">
        <h3>REGISTER COMPANY</h3>
          <form onSubmit={this.handleSubmit}>
            <label for="registerCompanyName">Company Name</label>
            <input onChange={this.handleChange} name="registerCompanyName" id="registerCompanyName" className="" type="text"></input>
            {
              formErrors.registerCompanyName ? <span className="errorMessage" data-error="wrong" data-success="right">{formErrors.registerCompanyName}</span> : ''
            }
            <label for="registerCompanyAddress">Address</label>
            <input onChange={this.handleChange} name="registerCompanyAddress" id="registerCompanyAddress" className="formInput" type="text"></input>
            {
              formErrors.registerCompanyAddress ? <span className="errorMessage" data-error="wrong" data-success="right">{formErrors.registerCompanyAddress}</span> : ''
            }
            <label for="registerCompanyCity">City</label>
            <input onChange={this.handleChange} name="registerCompanyCity" id="registerCompanyCity" className="formInput" type="text"></input>
            {
              formErrors.registerCompanyCity ? <span className="errorMessage" data-error="wrong" data-success="right">{formErrors.registerCompanyCity}</span> : ''
            }
            <label for="registerCompanyState">State</label>
            <input onChange={this.handleChange} name="registerCompanyState" id="registerCompanyState" className="formInput" type="text"></input>
            {
              formErrors.registerCompanyState ? <span className="errorMessage" data-error="wrong" data-success="right">{formErrors.registerCompanyState}</span> : ''
            }    
            <label for="registerCompanyZip">Zip</label>
            <input onChange={this.handleChange} name="registerCompanyZip" id="registerCompanyZip" className="formInput" type="text"></input>
            {
              formErrors.registerCompanyZip ? <span className="errorMessage" data-error="wrong" data-success="right">{formErrors.registerCompanyZip}</span> : ''
            }
            <div>
            <h5>Does Your company have trucks to deliver with?</h5>
            <label>
              <input onChange={this.handleChange} id="deliveryTrucks" name="deliveryTrucks" type="checkbox" />
              <span>Yes</span>
            </label>
            </div>

            {
              this.state.deliveryTrucks ? 
              <div>
              <label for="numberOfTrucks">Number Of Trucks</label>
              <input onChange={this.handleChange} value={this.state.numberOfTrucks} name="numberOfTrucks" id="numberOfTrucks" className="formInput" type="text"></input>
              <label for="costPerMile">Cost Per Mile ex. $1.52</label>
              <input onChange={this.handleChange} value={this.state.costPerMile} name="costPerMile" id="costPerMile" className="formInput" type="text"></input>
              {
              formErrors.costPerMile ? <span className="errorMessage" data-error="wrong" data-success="right">{formErrors.costPerMile}</span> : ''
              }
              </div>
              :
              ''
            }

            <button id="registerButton" className="button btn">Submit</button>
          </form>
      </div>
    )
    }
  }
}
