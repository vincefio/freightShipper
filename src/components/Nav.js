import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import M from 'materialize-css'
import fire from '../config/firebase';

export default class Nav extends Component {
    constructor(props){
        super(props)

        this.signOut = this.signOut.bind(this)
    }

    componentDidMount() {
        let elems = document.querySelectorAll('.dropdown-trigger');
        M.Dropdown.init(elems, { inDuration: 300, outDuration: 225 });

    }

    signOut(){
        console.log('clicked')
        fire.auth().signOut();
    }

    render() {
        if(this.props.user){
            return (
                <div>
                    <nav className='black'>
                        <div className="nav-wrapper">
                            <a className="logo">Freight Shipper</a>
                            <ul id="nav-mobile" className="right ">
    
                            <li className="hide-on-med-and-down"><Link to="/">Home</Link></li> 
                            <li className="hide-on-med-and-down"><Link to="/listings">Listings</Link></li>  
                            <li className="hide-on-med-and-down"><Link to="/dashboard">Dashboard</Link></li>
                        {/*for the logout we need to change the state of the parent */}
                             <li onClick={this.signOut} className="hide-on-med-and-down"><Link to="/">Logout</Link></li>
                         
                                <a className='dropdown-trigger hide-on-large-only' href='#' data-target='dropdown1'><i className='material-icons'>dehaze</i></a>
                            </ul>
    
                            <ul id='dropdown1' className='dropdown-content'>
                                <li className=""><Link to="/">Home</Link></li>
                                <li className=""><Link to="/dashboard">Dashboard</Link></li>
                                <li className="hide-on-med-and-down"><Link to="/listings">Listings</Link></li>  
                                <li onClick={this.signOut} className=""><Link to="/">Logout</Link></li>
                            </ul>
    
                        </div>
                    </nav>
                </div>
            )
        }else{
            return(
                <nav className='black'>
                        <div className="nav-wrapper">
                            <a className="logo">Freight Shipper</a>
                        </div>
                    </nav>
            )
        }

    }
}
