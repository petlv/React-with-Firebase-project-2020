import React from 'react';
import styles from './Landing.module.css';
import Map from '../Map';

const Landing = () => (
    <div className={styles['body']}>
        <h1>Landing</h1>
        <Map/>
    </div>
);

export default Landing;