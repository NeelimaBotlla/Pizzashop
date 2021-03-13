import React, { Fragment, useEffect, useState } from "react";

const SuppliedItemsTable = () => {

    const [suppliedItems, setSuppliedItems] = useState([]);
    const [stock, setStock] = useState("");
    const [ingredientNames, setIngredientNames] = useState([]);
    const [countries, setCountries] = useState([]);
    const [ingredientId, setIngredientId] = useState("");
    const [supplierId, setSupplierId] = useState("");
    const [restock, setRestock] = useState("");
    const [suppliers, setSuppliers] = useState([]);

    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            const body = {
                supplierId: supplierId,
                ingredientId: ingredientId,
                restockValue: restock
            };
            await fetch("http://localhost:8080/api/v1/suppliedItems", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            window.location = "/PizzaBaker";
        } catch (err) {
            console.error(err.message);
        }
    }

    const updateSuppliedItem = async (e, supplierId, ingredientId) => {
        e.preventDefault();
        try {
            const body = { stock };
            await fetch(`http://localhost:8080/api/v1/suppliedItems/${supplierId}/${ingredientId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            window.location = "/PizzaBaker";
            // console.log(e);
        } catch (err) {
            console.error(err.message);
        }
    }

    const deleteSuppliedItem = async (supplierId, ingredientId) => {
        try {
            await fetch(`http://localhost:8080/api/v1/suppliedItems/${supplierId}/${ingredientId}`, {
                method: "DELETE"
            });
            setSuppliedItems(suppliedItems.filter(suppliedItem => (!((suppliedItem.supplierid === supplierId) && (suppliedItem.ingredientid === ingredientId)))))
        } catch (err) {
            console.error(err.message);
        }
    }

    const getSuppliedItems = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/v1/suppliedItems");
            const jsonData = await response.json();
            setSuppliedItems(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    }

    const getIngredientNames = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/v1/ingredientNames");
            const jsonData = await response.json();
            setIngredientNames(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    }

    const getCountries = async (name) => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/countries/${name}`);
            const jsonData = await response.json();
            setCountries(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    }

    const getSuppliers = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/v1/validSuppliers");
            const jsonData = await response.json();
            setSuppliers(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        getSuppliedItems();
        getIngredientNames();
        getSuppliers();
    }, []);


    return (
        <div className="container">
            <h3 className="text-info text-center bg-dark">Supplied Items</h3>
            <div className="text-info">
                <form className="d-flex mt-1" onSubmit={onSubmitForm}>
                    <div>
                        <label>Select Ingredient Name</label>
                        <select className="form-control" defaultValue="Select" onChange={e => getCountries(e.target.value)}>
                            <option disabled value="Select">Select</option>
                            {ingredientNames.map(ingredientName => (
                                <option key={ingredientName.name} value={ingredientName.name}>{ingredientName.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="ml-2">
                        <label>Regional Provience</label>
                        <select className="form-control" defaultValue="Select" onClick={e => setIngredientId(e.target.value)}>
                            <option disabled value="Select">Select</option>
                            {countries.map(country => (
                                <option key={country.id} value={country.id}>{country.country}</option>
                            ))}
                        </select>
                    </div>
                    <div className="ml-2">
                        <label>Supplier</label>
                        <select className="form-control" defaultValue="Select" onClick={e => setSupplierId(e.target.value)}>
                            <option disabled value="Select">Select</option>
                            {suppliers.map(supplier => (
                                <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="ml-2">
                        <label>Restock</label>
                        <input id="Restock" type="number" className="form-control" value={restock} onChange={e => setRestock(e.target.value)}></input>
                    </div>
                    <div className="ml-2 mt-4">
                        <button className="btn btn-success">Add Item</button>
                    </div>
                </form>
            </div>
            <table className="table table-hover table-light mt-2 text-info text-center border">
                <thead>
                    <tr className="bg-light">
                        <th scope="col">Ingredient</th>
                        <th scope="col">Regional Provience</th>
                        <th scope="col">Supplied By</th>
                        <th scope="col">Restock</th>
                        <th scope="col">Edit</th>
                        <th scope="col">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {suppliedItems.map(suppliedItem => (
                        <tr key={`sid${suppliedItem.supplierid}iid${suppliedItem.ingredientid}`}>
                            <td>{suppliedItem.ingredientname}</td>
                            <td>{suppliedItem.country}</td>
                            <td>{suppliedItem.suppliername}</td>
                            <td>{suppliedItem.restockvalue}</td>
                            <td>
                                <Fragment>
                                    <button type="button" className="btn btn-warning" data-toggle="modal" data-target={`#s${suppliedItem.supplierid}i${suppliedItem.ingredientid}`} onClick={() => setStock(suppliedItem.restockvalue)}>
                                        Edit
                                    </button>
                                    <div className="modal" id={`s${suppliedItem.supplierid}i${suppliedItem.ingredientid}`}>
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h4 className="modal-title">Edit Restock Amount</h4>
                                                    <button type="button" className="close" data-dismiss="modal" onClick={() => setStock(suppliedItem.restockvalue)}>&times;</button>
                                                </div>
                                                <div className="modal-body">
                                                    <input type="text" className="form-control" value={stock} onChange={e => setStock(e.target.value)} />
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-warning" data-dismiss="modal" onClick={e => updateSuppliedItem(e, suppliedItem.supplierid, suppliedItem.ingredientid)}>Edit</button>
                                                    <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={() => setStock(suppliedItem.restockvalue)}>Close</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>
                            </td>
                            <td><button className="btn btn-danger" onClick={() => deleteSuppliedItem(suppliedItem.supplierid, suppliedItem.ingredientid)}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default SuppliedItemsTable;
