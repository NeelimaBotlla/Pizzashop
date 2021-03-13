import React from 'react';
import './App.css';
import Home from './pages/Home';
import PizzaBaker from './pages/PizzaBaker';
import PizzaCustomer from './pages/PizzaCustomer';
import OrdersPage from './pages/OrdersPage';
import Error from './pages/Error';
import NavBar from './components/NavBar';

import { Route, Switch } from "react-router-dom";

function App() {
  return (
    <>
      <NavBar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/pizzaBaker" component={PizzaBaker} />
        <Route exact path="/pizzaCustomer" component={PizzaCustomer} />
        <Route exact path="/recentOrders" component={OrdersPage} />
        <Route component={Error} />
      </Switch>
    </>
  )
};

export default App;
