import React from 'react';
import IngredientsTable from '../components/IngredientsTable';
import PizzaBaseTable from '../components/PizzaBaseTable';
import SuppliedItemsTable from '../components/SuppliedItemsTable';
import SupplierTable from '../components/SupplierTable';
import Orders from '../components/Orders';

const PizzaBaker = () => {
    return (
        <div>
            <Orders />
            <div className="row mt-5">
                <div className="col col-6"><PizzaBaseTable /></div>
                <div className="col col-6"><SupplierTable /></div>
            </div>
            <IngredientsTable />
            <SuppliedItemsTable />
        </div>
    )
};

export default PizzaBaker;
