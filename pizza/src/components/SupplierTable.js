import React, { Fragment, useEffect, useState } from "react";
import Toggle from 'react-toggle';

const SupplierTable = () => {

    const [suppliers, setSuppliers] = useState([]);
    const [supplierName, setSupplierName] = useState("");
    const [name, setName] = useState("");

    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            const body = { name : supplierName };
            await fetch("http://localhost:8080/api/v1/suppliers", {
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
    
    const updateSupplier = async (e, id) => {
        e.preventDefault();
        try {
            const body = { name };
            await fetch(`http://localhost:8080/api/v1/suppliers/${id}`, {
                method: "PUT",
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
                await fetch(`http://localhost:8080/api/v1/suppliers/show/${id}`);
            }
            else {
                await fetch(`http://localhost:8080/api/v1/suppliers/hide/${id}`)
            }
            window.location = "/PizzaBaker";
        } catch (err) {
            console.error(err.message);
        }
    }

    const deleteSupplier = async (id) => {
        try {
            await fetch(`http://localhost:8080/api/v1/suppliers/${id}`, {
                method: "DELETE"
            });
            setSuppliers(suppliers.filter(supplier => supplier.id !== id));
        } catch (err) {
            console.error(err.message);
        }
    }

    const getSuppliers = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/v1/suppliers");
            const jsonData = await response.json();
            setSuppliers(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        getSuppliers();
    }, []);

    return (
        <div className="container">
            <h3 className="text-info text-center bg-dark">Suppliers</h3>
            <div className="text-info">
                <form className="d-flex mt-1" onSubmit={onSubmitForm}>
                    <div>
                        <label>Supplier Name</label>
                        <input id="supplierName" type="text" className="form-control" value={supplierName} onChange={e => setSupplierName(e.target.value)}></input>
                    </div>
                    <div className="ml-1 mt-4">
                        <button className="btn btn-success">Add Supplier</button>
                    </div>
                </form>
            </div>
            <table className="table table-hover table-light mt-2 text-info text-center border">
                <thead>
                    <tr className="bg-light">
                        <th scope="col">Supplier Name</th>
                        <th scope="col">Edit</th>
                        <th scope="col">Delete</th>
                        <th scope="col">Hide/Show</th>
                    </tr>
                </thead>
                <tbody>
                    {suppliers.map(supplier => (
                        <tr key={`sup${supplier.id}`}>
                            <td>{supplier.name}</td>
                            <td>
                                <Fragment>
                                    <button type="button" className="btn btn-warning" data-toggle="modal" data-target={`#supplier${supplier.id}`} onClick={() => setName(supplier.name)}>
                                        Edit
                                    </button>
                                    <div className="modal" id={`supplier${supplier.id}`}>
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h4 className="modal-title">Edit Supplier</h4>
                                                    <button type="button" className="close" data-dismiss="modal" onClick={() => setName(supplier.name)}>&times;</button>
                                                </div>
                                                <div className="modal-body">
                                                    <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} />
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-warning" data-dismiss="modal" onClick={e => updateSupplier(e, supplier.id)}>Edit</button>
                                                    <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={() => setName(supplier.name)}>Close</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>
                            </td>
                            <td><button className="btn btn-danger" onClick={() => deleteSupplier(supplier.id)}>Delete</button></td>
                            <td className="d-flex center">
                                <span>Show</span>
                                <Toggle
                                    defaultChecked={supplier.hide ? supplier.hide : false}
                                    className='custom-classname'
                                    onChange={e => handleToggle(supplier.id, e)} />
                                <span>Hide</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default SupplierTable;
