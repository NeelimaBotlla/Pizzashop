import React from 'react';
import Intro from '../components/Intro';
import PizzaBase from '../components/PizzaBase';

const Home = () => {
    return (
        <div>
            <Intro/>
            <h1 className="ml-5 text-primaryColor">Want to Order a Pizza???</h1>
            <PizzaBase/>
        </div>
    )
};

export default Home;
