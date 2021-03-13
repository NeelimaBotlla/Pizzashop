import React, { useState, useEffect } from "react";

const PizzaBase = () => {
    const [bases, setBases] = useState([]);

    const addBase = async (e, id, price) => {
        e.preventDefault();
        try {
            const body = {
                baseId: id,
                basePrice: price
            };
            await fetch(`http://localhost:8080/api/v1/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            window.location = "/pizzaCustomer";
        } catch (err) {
            console.error(err.message);
        }
    }

    const fetchBases = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/bases`);
            const jsonData = await response.json();
            setBases(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        fetchBases();
    }, []);

    return (
        <div >
            <div className="row">
                <div className="col col-6 mb-4 ml-5">
                    <form action="">
                        <div>
                            <h4 className="text-center text-info mt-3 col-6">Select Pizza Base</h4>
                        </div>
                        <div className="form-row">
                            <div className="col">
                                <table className="table table-hover table-dark">
                                    <thead>
                                        <tr className="bg-primary">
                                            <th scope="col">Pizza Base</th>
                                            <th scope="col">Price</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bases.map(base => (
                                            <tr key={base.id}>
                                                <td>{base.size}</td>
                                                <td>{base.price} €</td>
                                                <td>
                                                    <button onClick={e => addBase(e, base.id, base.price)} type="submit" className="btn btn-primary">Order</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default PizzaBase;