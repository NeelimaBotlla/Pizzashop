import React, { Fragment, useEffect, useState } from "react";

const PizzaBaseTable = () => {

    const [bases, setBases] = useState([]);
    const [baseSize, setBaseSize] = useState("");
    const [basePrice, setBasePrice] = useState("");
    const [size, setSize] = useState("");
    const [price, setPrice] = useState("");

    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            const body = {
                size: baseSize,
                price: basePrice
            };
            await fetch("http://localhost:8080/api/v1/bases", {
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

    const handleClose = (size, price) => {
        setPrice(price);
        setSize(size);
    }

    const updateBase = async (e, id) => {
        e.preventDefault();
        try {
            const body = {
                size: size,
                price: price
            };
            await fetch(`http://localhost:8080/api/v1/bases/${id}`, {
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

    const deleteBase = async (id) => {
        try {
            await fetch(`http://localhost:8080/api/v1/bases/${id}`, {
                method: "DELETE"
            });
            setBases(bases.filter(base => base.id !== id));
        } catch (err) {
            console.error(err.message);
        }
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

    useEffect(() => {
        getBases();
    }, []);

    return (
        <div className="container">
            <h3 className="text-info text-center bg-dark">Bases</h3>
            <div className="text-info">
                <form className="d-flex mt-1" onSubmit={onSubmitForm}>
                    <div>
                        <label>Base Size</label>
                        <input id="basesize" type="text" className="form-control" value={baseSize} onChange={e => setBaseSize(e.target.value)}></input>
                    </div>
                    <div className="ml-1">
                        <label>Base Price</label>
                        <input id="baseprice" type="number" className="form-control" value={basePrice} onChange={e => setBasePrice(e.target.value)}></input>
                    </div>
                    <div className="ml-1 mt-2">
                        <button className="btn btn-success">Add Base</button>
                    </div>
                </form>
            </div>
            <table className="table table-hover table-light mt-2 text-info text-center border">
                <thead>
                    <tr className="bg-light">
                        <th scope="col">Base Size</th>
                        <th scope="col">Base Price</th>
                        <th scope="col">Edit</th>
                        <th scope="col">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {bases.map(base => (
                        <tr key={`base${base.id}`}>
                            <td>{base.size}</td>
                            <td>{base.price} €</td>
                            <td>
                                <Fragment>
                                    <button type="button" className="btn btn-warning" data-toggle="modal" data-target={`#base${base.id}`}>
                                        Edit
                                    </button>
                                    <div className="modal" id={`base${base.id}`}>
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h4 className="modal-title">Edit Base</h4>
                                                    <button type="button" className="close" data-dismiss="modal" onClick={() => handleClose(base.size, base.price)}>&times;</button>
                                                </div>
                                                <div className="modal-body">
                                                    <form action="">
                                                        <div className="form-group">
                                                            <label>Base Size</label>
                                                            <input type="text" className="form-control" id="size" value={size} onChange={e => setSize(e.target.value)} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Base Size</label>
                                                            <input type="number" className="form-control" id="price" value={price} onChange={e => setPrice(e.target.value)} />
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-warning" data-dismiss="modal" onClick={e => updateBase(e, base.id)}>Edit</button>
                                                    <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={() => handleClose(base.size, base.price)}>Close</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>
                            </td>
                            <td><button className="btn btn-danger" onClick={() => deleteBase(base.id)}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default PizzaBaseTable
