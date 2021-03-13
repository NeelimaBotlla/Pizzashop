import React, { Fragment, useEffect, useState } from "react";
import UpdateIngredient from '../components/UpdateIngredient';
import Toggle from 'react-toggle';

const IngredientsTable = () => {

    const [ingredients, setIngredients] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [country, setCountry] = useState("");
    const [stock, setStock] = useState("");
    const [reStock, setReStock] = useState("");

    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            const body = {
                name: name,
                price: price,
                country: country,
                stock: stock
            };
            await fetch("http://localhost:8080/api/v1/ingredients", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            window.location = "/PizzaBaker";
            // console.log(response);
        } catch (err) {
            console.error(err.message);
        }
    }

    const handleToggle = async (id, e) => {
        e.preventDefault();
        try {
            if (e.target.checked === false) {
                await fetch(`http://localhost:8080/api/v1/ingredients/show/${id}`);
            }
            else {
                await fetch(`http://localhost:8080/api/v1/ingredients/hide/${id}`)
            }
            window.location = "/PizzaBaker";
        } catch (err) {
            console.error(err.message);
        }
    }

    const deleteIngredient = async (id) => {
        try {
            await fetch(`http://localhost:8080/api/v1/ingredients/${id}`, {
                method: "DELETE"
            });
            setIngredients(ingredients.filter(ingredient => ingredient.id !== id));
        } catch (err) {
            console.error(err.message);
        }
    }

    const restockIngredient = async (ingId) => {
        try {
            await fetch(`http://localhost:8080/api/v1/incrementIngredient/${ingId}/${reStock}`);
            window.location = "/pizzaBaker";
            setReStock("");
        } catch (err) {
            console.error(err.message);
        }
    }

    const getSuppliers = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/suppliedItems/ingredient/${id}`);
            const jsonData = await response.json();
            setSuppliers(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    }

    const getIngredients = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/v1/ingredients");
            const jsonData = await response.json();
            setIngredients(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        getIngredients();
    }, []);

    return (
        <div className="container">
            <h3 className="text-info text-center bg-dark">Ingredients</h3>
            <div className="text-info">
                <form className="d-flex mt-1" onSubmit={onSubmitForm}>
                    <div>
                        <label>Ingredient Name</label>
                        <input id="name" type="text" className="form-control" value={name} onChange={e => setName(e.target.value)}></input>
                    </div>
                    <div className="ml-1">
                        <label>Ingredient Price</label>
                        <input id="price" type="number" className="form-control" value={price} onChange={e => setPrice(e.target.value)}></input>
                    </div>
                    <div className="ml-1">
                        <label>Regional Provience</label>
                        <input id="country" type="text" className="form-control" value={country} onChange={e => setCountry(e.target.value)}></input>
                    </div>
                    <div className="ml-1">
                        <label>Stock</label>
                        <input id="stock" type="number" className="form-control" value={stock} onChange={e => setStock(e.target.value)}></input>
                    </div>
                    <div className="ml-1 mt-2">
                        <button className="btn btn-success">Add Ingredient</button>
                    </div>
                </form>
            </div>
            <table className="table table-hover table-light mt-2 text-info text-center border">
                <thead>
                    <tr className="bg-light">
                        <th scope="col">Ingredient Name</th>
                        <th scope="col">Regional Provience</th>
                        <th scope="col">Ingredient Price</th>
                        <th scope="col">Stock</th>
                        <th scope="col">Edit</th>
                        <th scope="col">Delete</th>
                        <th scope="col">Hide/Show</th>
                        <th scope="col">Restock</th>
                    </tr>
                </thead>
                <tbody>
                    {ingredients.map(ingredient => (
                        <tr key={`ing${ingredient.id}`}>
                            <td>{ingredient.name}</td>
                            <td>{ingredient.country}</td>
                            <td>{ingredient.price} €</td>
                            <td>{ingredient.stock}</td>
                            <td>
                                <UpdateIngredient ingredient={ingredient} />
                            </td>
                            <td><button className="btn btn-danger" onClick={() => deleteIngredient(ingredient.id)}>Delete</button></td>
                            <td className="d-flex">
                                <span>Show</span>
                                <Toggle
                                    defaultChecked={ingredient.hide ? ingredient.hide : false}
                                    className='custom-classname'
                                    onChange={e => handleToggle(ingredient.id, e)} />
                                <span>Hide</span>
                            </td>
                            <td>
                                <Fragment>
                                    <button type="button" className="btn btn-success" data-toggle="modal" data-target={`#ingr${ingredient.id}`} onClick={() => getSuppliers(ingredient.id)}>
                                        Restock
                                    </button>
                                    <div className="modal" id={`ingr${ingredient.id}`}>
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h4 className="modal-title">Choose Supplier to Restock Ingredient - {ingredient.name} ({ingredient.country})</h4>
                                                    <button type="button" className="close" data-dismiss="modal" onClick={() => setReStock("")}>&times;</button>
                                                </div>
                                                <div className="modal-body">
                                                    <h4 className="text-info">Select Supplier</h4>
                                                    <select className="form-control" defaultValue="Select" onClick={e => setReStock(e.target.value)}>
                                                        <option disabled value="Select">Select</option>
                                                        {suppliers.map(supplier => (
                                                            <option key={supplier.id} disabled={supplier.hide} value={supplier.restockvalue}>{supplier.name} ({supplier.restockvalue} units)</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-success" data-dismiss="modal" onClick={() => restockIngredient(ingredient.id)}>Restock</button>
                                                    <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={() => setReStock("")}>Close</button>
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
    )
}

export default IngredientsTable;
