import React, { Component } from 'react';
import fire from './config/firebase.js'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import Nav from './components/Nav.js';
import Login from './components/Login.js';
import Home from './components/Home.js';
import RegisterCompany from './components/RegisterCompany.js'
import HireCompany from './components/HireCompany.js'
import Dashboard from './components/Dashboard.js'
import Listings from './components/Listings.js'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      user: {},
    }
  }
  componentDidMount(){
    this.authListener();

  }

  authListener(){
    fire.auth().onAuthStateChanged((user) => {
      if(user){
        this.setState({ user });
      }else{
        this.setState({ user: null })
      }
    })
  }
  
  render() {
    const { user } = this.state
    return (
      <div className="App">
          <Nav user={this.state.user}/>
            {/* {this.state.user ? (<Home user={this.state.user.email}/>) : (<Login />)} */}
 
        {/* <Route exact path='/' component={Home} /> */}
        {
          !this.state.user &&
            <Route exact path='/' component={Login} />
            
        }
        {
          this.state.user && 
            <Route exact path='/' component={Home} />
        }

        <Route exact path="/register" render={(props) => <RegisterCompany user={user}/>} />
        <Route exact path="/hire" render={(props) => <HireCompany user={user}/>} />
        {/* <Route exact path="/hire" component={HireCompany} /> */}
        <Route exact path="/login" component={Login} />
        <Route exact path="/dashboard" render={(props) => <Dashboard user={user}/>} />
        <Route exact path="/listings" render={(props) => <Listings user={user}/>} />
      </div>
    );
  }
}

export default App;
