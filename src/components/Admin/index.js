import React from 'react';
import { Switch, Route} from 'react-router-dom';
import { compose } from 'recompose';

import { withAuthorization, withEmailVerification } from '../Session';
import {UserList, UserItem} from "../Users";
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';
import styles from "./Admin.module.css";

const AdminPage = () => (
    <div className={styles['body']}>
        <h1>Admin</h1>
        <p>The Admin Page is accessible by every signed in admin user.</p>

        <Switch>
            <Route path={ROUTES.ADMIN_DETAILS} component={UserItem} />
            <Route path={ROUTES.ADMIN} component={UserList} />
        </Switch>
    </div>
);

const condition = authUser =>
    authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
    withEmailVerification,
    withAuthorization(condition),
)(AdminPage);