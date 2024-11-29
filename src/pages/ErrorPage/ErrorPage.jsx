import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ErrorPage.module.scss';
import backgroundImage from '../../img/error.webp'; 

console.log(backgroundImage); 

const ErrorPage = () => {
    return (
        <div
            className={styles['error-page']}
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <Link to="/">Go back to Home Page</Link>
        </div>
    );
};

export default ErrorPage;
