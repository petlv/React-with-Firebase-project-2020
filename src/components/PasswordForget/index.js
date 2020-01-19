import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import './passwordForget.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'


const PasswordForgetPage = () => (
    <div>
        <h1>PasswordForget</h1>
        <PasswordForgetForm />
    </div>
);

const INITIAL_STATE = {
    email: '',
    error: null,
};

let confirmEmailSent = false;

class PasswordForgetFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE, confirmEmailSent };
    }

    onSubmit = event => {
        const { email } = this.state;
        this.props.firebase
            .doPasswordReset(email)
            .then(() => {
                this.setState({ ...INITIAL_STATE, confirmEmailSent: true });
            })
            .catch(error => {
                this.setState({ error });
            });
        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    renderSuccessMessage() {
        return (
            <div className="ResetPassword">
                <div className="success">
                    <FontAwesomeIcon icon={faCoffee} style={{ color: 'grey' }} />
                    <p>Your password has been reset!</p>
                    <p>
                        <Link to={ROUTES.SIGN_IN}>
                            Click here to login with your new credentials
                        </Link>
                    </p>
                </div>
            </div>
        );
    }

    componentWillUnmount() {
        this.setState({ confirmEmailSent: false });
    }

    render() {
        const { email, error, confirmEmailSent } = this.state;
        const isInvalid = email === '';
        return (
            <form onSubmit={this.onSubmit}>
                <input
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Email Address"
                />
                <button disabled={isInvalid} type="submit">
                    Reset My Password
                </button>
                {error && <p>{error.message}</p>}
                {confirmEmailSent && this.renderSuccessMessage()}
            </form>
        );
    }
}

const PasswordForgetLink = () => (
    <p>
        <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
    </p>
);

export default PasswordForgetPage;
const PasswordForgetForm = withFirebase(PasswordForgetFormBase);
export { PasswordForgetForm, PasswordForgetLink };