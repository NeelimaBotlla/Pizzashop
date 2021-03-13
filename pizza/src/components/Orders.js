import React, { Fragment, useState, useEffect } from "react";

const Orders = () => {

    const [orders, setOrders] = useState([]);
    const [orderLogs, setOrderLogs] = useState([]);
    const [corder, setcOrder] = useState({});

    const fetchOrderLogs = async (orderId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/orderLogs/${orderId}`);
            const jsonData = await response.json();
            setOrderLogs(jsonData);
            const resp = await fetch(`http://localhost:8080/api/v1/orders/${orderId}`);
            const jsonResp = await resp.json();
            setcOrder(jsonResp[0]);
        } catch (err) {
            console.error(err.message);
        }
    }

    const deleteOrder = async (id) => {
        try {
            await fetch(`http://localhost:8080/api/v1/orders/${id}`, {
                method: "DELETE"
            });
            setOrders(orders.filter(order => order.orderid !== id));
        } catch (err) {
            console.error(err.message);
        }
    }

    const fetchOrders = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/orders`);
            const jsonData = await response.json();
            setOrders(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, []);
    // Take another function to set base in an object in the fetchOrders function using the base_id
    return (
        <div>
            <div className="d-flex ml-3 mr-3">
                <div className="list-group col">
                    <h3 className="text-center text-info">Recent Orders</h3>
                    <table className="table table-hover table-light">
                        <thead>
                            <tr className="bg-primary">
                                <th scope="col">Order Id</th>
                                <th scope="col">Base</th>
                                <th scope="col">Total Price</th>
                                <th scope="col">Time</th>
                                <th scope="col">Details</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.orderid}>
                                    <td>{order.orderid}</td>
                                    <td>Base - {order.basesize}</td>
                                    <td>{order.totalprice} €</td>
                                    <td className="text-inline">{order.orderedat}</td>
                                    <td>
                                        <Fragment>
                                            <button type="button" className="btn-secondary" data-toggle="modal" data-target={`#order${order.orderid}`} onClick={() => fetchOrderLogs(order.orderid)}>
                                                Details
                                        </button>
                                            <div className="modal" id={`order${order.orderid}`}>
                                                <div className="modal-dialog">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h4 className="modal-title">Ingredients</h4>
                                                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                                                        </div>
                                                        <div className="modal-body">
                                                            <div>
                                                                <div className="d-flex ml-3 mr-3">
                                                                    <div className="list-group col">
                                                                        <table className="table table-hover table-light w-100">
                                                                            <thead>
                                                                                <tr className="bg-info">
                                                                                    <th scope="col">Ingredient</th>
                                                                                    <th scope="col">Country</th>
                                                                                    <th scope="col">Quantity</th>
                                                                                    <th scope="col">Price</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td>Base ({order.basesize})</td>
                                                                                    <td> - </td>
                                                                                    <td>1</td>
                                                                                    <td>{corder.baseprice} €</td>
                                                                                </tr>
                                                                                {orderLogs.map(orderLog => (
                                                                                    <tr key={orderLog.logid}>
                                                                                        <td>{orderLog.name}</td>
                                                                                        <td>{orderLog.country}</td>
                                                                                        <td>{orderLog.quantity}</td>
                                                                                        <td>{orderLog.price} €</td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Fragment>
                                    </td>
                                    <td><button className="btn btn-danger" onClick={() => deleteOrder(order.orderid)}>Delete</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Orders;
