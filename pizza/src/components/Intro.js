import React, { Fragment } from "react";

const Intro = () => {
    return (
        <Fragment>
            <div className="jumbotron">
                <div className="row text-center">
                    <div className="col col-3">
                        <img className="bg w-100" src="pizzalogo.jpg" alt=""></img>
                    </div>
                    <div className="col col-9 text-center center">
                        <div>
                            <h1 className="row text-primaryColor">POTATO PIZZA SHOP</h1>
                            <p className="row text-dark">First ever Pizza shop having potato in it!</p>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Intro;