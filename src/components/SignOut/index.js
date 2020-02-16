import React from 'react';
import { withFirebase } from '../Firebase';
import styles from './SignOut.module.css';

const SignOutButton = ({ firebase }) => (
    <button type="button" onClick={firebase.doSignOut} className={styles['navigation-list-item-anchor']}>
        Sign Out
    </button>
);
export default withFirebase(SignOutButton);