import React, { Component } from 'react'
import fire from '../config/firebase';
import Truck from '../img/freightPic2.jpg';
import { Link } from 'react-router-dom';
import firebase from 'firebase';

export default class Home extends Component {
    constructor(props){
        super(props);

        // var database = firebase.firestore();

        // var docRef = database.collection("companies").doc("chest");

        // docRef.get().then(function(doc) {
        //     if (doc.exists) {
        //         console.log("Document data:", doc.data());
        //     } else {
        //         // doc.data() will be undefined in this case
        //         console.log("No such document!");
        //     }
        // }).catch(function(error) {
        //     console.log("Error getting document:", error);
        // });

        this.signOut = this.signOut.bind(this);
        //<img className="backgroundImg" src={Truck} alt="truck"></img>
    }

    signOut(){
        fire.auth().signOut();
    }
  render() {
    return (
      <div>
            <header>
                <div className="headerWrap">
             
                    <h2 className="headerText">Ship the Freight Way</h2>
   
   
                    <button id="headerButton1" className="btn header_button"><Link to="/hire">Hire a Freight Company</Link></button>
                    <button id="headerButton2" className="btn header_button"><Link to="/register">Register Your Company</Link></button>
                    {/* <button onClick={this.signOut} id="headerButton3" className="btn header_button">Sign Out</button> */}
                </div>
            </header>
{/* 
            <h1>WERE KILLIN THIS SHIT HOMEEEE</h1>
            <h2>Hello {this.props.user}</h2>
            <button onClick={this.signOut}>Log Out</button> */}
            <footer className="footer">

            </footer>
      </div>
    )
  }
}
