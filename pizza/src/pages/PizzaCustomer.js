import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PizzaCustomer = () => {

    const [order, setOrder] = useState("");
    const [bases, setBases] = useState([]);
    const [baseid, setBaseid] = useState("");
    const [baseprice, setBaseprice] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const [quantity, setQuantity] = useState("");
    const [orderLogs, setOrderLogs] = useState([]);
    const [orderId, setOrderId] = useState("");

    const deleteOrder = async (id) => {
        try {
            await fetch(`http://localhost:8080/api/v1/orders/${id}`, {
                method: "DELETE"
            });
        } catch (err) {
            console.error(err.message);
        }
    }
    
    const deleteIngredient = async (logId, ingId, price, q) => {
        try {
            await fetch(`http://localhost:8080/api/v1/orderLogs/${logId}`, {
                method: "DELETE"
            });
            await fetch(`http://localhost:8080/api/v1/incrementIngredient/${ingId}/${q}`);
            await fetch(`http://localhost:8080/api/v1/subPrice/${orderId}/${price}`);
            window.location = "/pizzaCustomer";
        } catch (err) {
            console.error(err.message);
        }
    }

    const addIngredient = async (e, id, price, stock) => {
        e.preventDefault();
        try {
            if (quantity <= stock && quantity > 0) {
                await fetch(`http://localhost:8080/api/v1/decrementIngredient/${id}/${quantity}`);
                await fetch(`http://localhost:8080/api/v1/addPrice/${orderId}/${quantity * price}`);
                window.location = "/pizzaCustomer";
            }
            else if (quantity <= 0) {
                alert("Please select valid quantity");
                window.location = "/pizzaCustomer";
            }
            else {
                alert("Stock not available");
                window.location = "/pizzaCustomer";
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    const updateOrderBase = async (e, price) => {
        e.preventDefault();
        try {
            const body = {
                baseId: baseid,
                basePrice: baseprice,
                previousBasePrice: price
            };
            await fetch(`http://localhost:8080/api/v1/orders/${orderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            window.location = "/pizzaCustomer";
            // console.log(response);
        } catch (err) {
            console.error(err.message);
        }
    }

    const handleClose = (id, price) => {
        setBaseid(id);
        setBaseprice(price);
    }

    const getBases = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/v1/bases");
            const jsonData = await response.json();
            setBases(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    }

    const fetchLastOrder = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/lastOrder`);
            const jsonData = await response.json();
            setOrder(jsonData[0]);
            setOrderId(jsonData[0].orderid);
            const resp = await fetch(`http://localhost:8080/api/v1/orderLogs/${jsonData[0].orderid}`);
            const jsonresponse = await resp.json();
            setOrderLogs(jsonresponse);
        } catch (err) {
            console.error(err.message);
            window.location = "/"
        }
    }

    const getBasePrice = async (id) => {
        try {
            setBaseid(id);
            const response = await fetch(`http://localhost:8080/api/v1/bases/${id}`);
            const jsonData = await response.json();
            setBaseprice(jsonData[0].price);
        } catch (err) {
            console.error(err.message);
        }
    }

    const getIngredients = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/showIngredients`);
            const jsonData = await response.json();
            setIngredients(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        fetchLastOrder();
        getBases();
        getIngredients();
    }, []);

    return (
        <div className="row">
            <div className="col col-6">
                <div className="list-group col">
                    <h3 className="text-center text-info">Add Ingredients</h3>
                    <table className="table table-hover table-light w-100">
                        <thead>
                            <tr className="bg-info">
                                <th scope="col">Ingredient Name</th>
                                <th scope="col">Regional Provience</th>
                                <th scope="col">Price</th>
                                <th scope="col">Stock</th>
                                <th scope="col">Add</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ingredients.map(ingredient => (
                                <tr key={ingredient.id}>
                                    <td>{ingredient.name}</td>
                                    <td>{ingredient.country}</td>
                                    <td>{ingredient.price} €</td>
                                    <td>{ingredient.stock}</td>
                                    <td>
                                        <Fragment>
                                            <button type="submit" className="btn btn-success" data-toggle="modal" data-target={`#ing${ingredient.id}`}>
                                                Add
                                            </button>
                                            <div className="modal" id={`ing${ingredient.id}`}>
                                                <div className="modal-dialog">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h4 className="modal-title">Add Ingredient Quantity</h4>
                                                            <button type="button" className="close" data-dismiss="modal" onClick={() => setQuantity("")}>&times;</button>
                                                        </div>
                                                        <div className="modal-body">
                                                            <div>
                                                                <h4>Ingredient: {ingredient.name} ({ingredient.country})</h4>
                                                                <h4>Price: {ingredient.price} €</h4>
                                                                <h4>Quantity: <input type="number" className="mb-2" value={quantity} onChange={e => setQuantity(e.target.value)}></input></h4>
                                                                <h4>TotalPrice: {quantity * ingredient.price} €</h4>
                                                            </div>
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button type="button" className="btn btn-warning" data-dismiss="modal" onClick={e => addIngredient(e, ingredient.id, ingredient.price, ingredient.stock)}>Add</button>
                                                            <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={() => setQuantity("")}>Close</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Fragment>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="col col-6">
                <div className="d-flex ml-5">
                    <div className="list-group col">
                        <h3 className="text-center text-info">Your Order</h3>
                        <h5 className="d-flex text-primaryColor">Order Id : <p className="text-info"> {order.orderid}</p></h5>
                        <h5 className="d-flex text-primaryColor">Total Price : <p className="text-info ml-1"> {order.totalprice}</p></h5>
                        <table className="table table-hover table-light w-100">
                            <thead>
                                <tr className="bg-info">
                                    <th scope="col">Items</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Edit/Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Base - {order.basesize}</td>
                                    <td>1</td>
                                    <td>{order.baseprice} €</td>
                                    <td>
                                        <Fragment>
                                            <button type="button" className="btn btn-warning" data-toggle="modal" data-target={`#orderid${order.orderid}`} onClick={() => handleClose(order.baseid, order.baseprice)}>
                                                Edit
                                            </button>
                                            <div className="modal" id={`orderid${order.orderid}`}>
                                                <div className="modal-dialog">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h4 className="modal-title">Edit Base</h4>
                                                            <button type="button" className="close" data-dismiss="modal" onClick={() => handleClose(order.baseid, order.baseprice)}>&times;</button>
                                                        </div>
                                                        <div className="modal-body">
                                                            <div>
                                                                <label>Select Base Size</label>
                                                                <select className="form-control" defaultValue="Select" onChange={e => getBasePrice(e.target.value)}>
                                                                    <option disabled value="Select">Select</option>
                                                                    {bases.map(base => (
                                                                        <option key={base.id} value={base.id}>{base.size}-{base.price} €</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button type="button" className="btn btn-warning" data-dismiss="modal" onClick={e => updateOrderBase(e, order.baseprice)}>Edit</button>
                                                            <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={() => handleClose(order.baseid, order.baseprice)}>Close</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Fragment>
                                    </td>
                                </tr>
                                {orderLogs.map(orderLog => (
                                    <tr key={orderLog.logid}>
                                        <td>{orderLog.name} ({orderLog.country})</td>
                                        <td>{orderLog.quantity}</td>
                                        <td>{orderLog.price} €</td>
                                        <td><button className="btn btn-danger" onClick={() => deleteIngredient(orderLog.logid, orderLog.ingredientid, orderLog.price, orderLog.quantity)}>Delete</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mt-5 center">
                    <Link to="/"><button type="submit" className="btn btn-danger mr-5" onClick={() => deleteOrder(order.orderid)}>Delete Order</button></Link>
                    <Link to="/recentOrders"><button type="submit" className="btn btn-success">Complete Order</button></Link>
                </div>
            </div>
        </div>
    )
};

export default PizzaCustomer;
