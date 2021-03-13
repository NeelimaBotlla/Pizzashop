import React, { Fragment, useState } from "react";

const UpdateIngredient = ({ ingredient }) => {
    
    const [name, setName] = useState(ingredient.name);
    const [price, setPrice] = useState(ingredient.price);
    const [country, setCountry] = useState(ingredient.country);

    const handleClose = () => {
        setName(ingredient.name);
        setPrice(ingredient.price);
        setCountry(ingredient.country);
    }

    const updateIngredient = async e => {
        e.preventDefault();
        try {
            const body = {
                name : name,
                price : price,
                country : country
            };
            await fetch(`http://localhost:8080/api/v1/ingredients/${ingredient.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            window.location = "/PizzaBaker";
        } catch (err) {
            console.error(err.message);
        }
    }

    return (
        <Fragment>
            <button type="button" className="btn btn-warning" data-toggle="modal" data-target={`#ingredient${ingredient.id}`}>
                Edit
            </button>
            <div className="modal" id={`ingredient${ingredient.id}`}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Edit ingredient</h4>
                            <button type="button" className="close" data-dismiss="modal" onClick={() => handleClose()}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <form action="">
                                <div className="form-group">
                                    <label>Ingredient Name</label>
                                    <input type="text" className="form-control" id="name" value={name} onChange={e => setName(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Ingredient Size</label>
                                    <input type="number" className="form-control" id="ingredientprice" value={price} onChange={e => setPrice(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Regional Provience</label>
                                    <input type="text" className="form-control" id="country" value={country} onChange={e => setCountry(e.target.value)} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-warning" data-dismiss="modal" onClick={e => updateIngredient(e)}>Edit</button>
                            <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={() => handleClose()}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default UpdateIngredient;
