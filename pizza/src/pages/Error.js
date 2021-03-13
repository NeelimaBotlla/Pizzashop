import React from 'react';
import { Link } from 'react-router-dom';

const Error = () => {
    return (
        <div><div className="container mt-5">
            <h1 className="text-center text-primaryColor">Error 404 Not found</h1>
        </div>
            <div className="container center">
                <Link to="/"><button type="button" className="btn-secondary">Home</button></Link>
            </div>
        </div>
    )
}

export default Error;
