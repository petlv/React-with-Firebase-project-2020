import React from 'react';
import { Link } from 'react-router-dom';

import { AuthUserContext } from '../Session';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import styles from './Navigation.module.css';

const Navigation = () => (
    <AuthUserContext.Consumer>
        {authUser =>
            authUser ? (
                <NavigationAuth authUser={authUser} />
            ) : (
                <NavigationNonAuth />
            )
        }
    </AuthUserContext.Consumer>
);

const NavigationAuth = ({ authUser }) => (
    <div className={styles['navigation']}>
        <ul className={styles['navigation-list']}>
            <li className={styles['navigation-list-item']}>
                <Link to={ROUTES.LANDING} className={styles['navigation-list-item-anchor']}>Landing</Link>
            </li>
            <li className={styles['navigation-list-item']}>
                <Link to={ROUTES.HOME} className={styles['navigation-list-item-anchor']}>Home</Link>
            </li>
            <li className={styles['navigation-list-item']}>
                <Link to={ROUTES.ACCOUNT} className={styles['navigation-list-item-anchor']}>Account</Link>
            </li>
            {!!authUser.roles[ROLES.ADMIN] && (
                <li className={styles['navigation-list-item']}>
                    <Link to={ROUTES.ADMIN} className={styles['navigation-list-item-anchor']}>Admin</Link>
                </li>
            )}
            <li className={styles['navigation-list-item']}>
                <SignOutButton />
            </li>
        </ul>
    </div>
);

const NavigationNonAuth = () => (
    <div className={styles['navigation']}>
        <ul className={styles['navigation-list']}>
            <li className={styles['navigation-list-item']}>
                <Link to={ROUTES.LANDING} className={styles['navigation-list-item-anchor']}>Landing</Link>
            </li>
            <li className={styles['navigation-list-item']}>
                <Link to={ROUTES.SIGN_IN} className={styles['navigation-list-item-anchor']}>Sign In</Link>
            </li>
        </ul>
    </div>
);

export default Navigation;