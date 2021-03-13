import React, { Component } from 'react';
import { FaAlignLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default class NavBar extends Component {
    state = {
        isOpen: false
    }

    handleToggle = () => {
        this.setState({ isOpen: !this.state.isOpen })
    }

    render() {
        return (
            <nav className="navbar">
                <div className="nav-center">
                    <div className="nav-header">
                        <button type="button" className="nav-btn" onClick={this.handleToggle}>
                            <FaAlignLeft className="nav-icon" />
                        </button>
                    </div>
                    <ul className={this.state.isOpen?"nav-links show-nav":"nav-links"}>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/pizzaBaker">Pizza Baker</Link>
                        </li>
                        {/* <li>
                            <Link to="/pizzaCustomer">Pizza Customer</Link>
                        </li> */}
                        <li>
                            <Link to="/recentOrders">Pizza Customer</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}
