import React from 'react';
import Orders from '../components/Orders';
import {Link} from 'react-router-dom';

const OrdersPage = () => {
    return (
        <div>
            <Orders/>
            <div className="container center">
                <button type="submit" className="btn btn-success"><Link to="/">New Order</Link></button>
            </div>
        </div>
    )
}

export default OrdersPage;
