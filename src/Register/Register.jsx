import React from 'react';
import * as yup from 'yup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import '../shared/styles/LoginAndRegister.css';
import withForm from '../shared/hocs/withForm';
import userService from '../services/user-service';



class Register extends React.Component {

    usernameOnChangeHandler = this.props.controlChangeHandlerFactory('username');
    passwordOnChangeHandler = this.props.controlChangeHandlerFactory('password');
    rePasswordOnChangeHandler = this.props.controlChangeHandlerFactory('rePassword');

    submitHandler = () => {
        // this.props.runValidations()
        //   .then(formData => console.log(formData));
        const errors = this.props.getFormErrorState();
        if (!!errors) { return; }
        const data = this.props.getFormState();
        userService.register(data).then(() => {
            this.props.history.push('/login');
        });
    };

    getFirstControlError = name => {
        const errorState = this.props.getFormErrorState();
        return errorState && errorState[name] && errorState[name][0];
    };

    render() {
        const usernameError = this.getFirstControlError('username');
        const passwordError = this.getFirstControlError('password');
        const rePasswordError = this.getFirstControlError('rePassword');

        return <main className="my-5 py-5">
            <Container className="px-0 col-xl-4">
                <Form>
                    <Form.Group as={Row} controlId="formHorizontalEmail">
                        <Form.Label column sm={2}>
                            Email
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control size="lg" type="email" placeholder="Email" />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formHorizontalPassword">
                        <Form.Label column sm={2}>
                            Password
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control size="lg" type="password" placeholder="Password" />
                        </Col>
                    </Form.Group>
                    <fieldset>
                        <Form.Group as={Row}>
                            <Form.Label as="legend" column sm={2}>
                                Radios
                            </Form.Label>
                            <Col sm={10} className="text-left">
                                <Form.Check
                                    type="radio"
                                    inline
                                    label="first radio"
                                    name="formHorizontalRadios"
                                    id="formHorizontalRadios1"
                                />
                                <Form.Check
                                    type="radio"
                                    inline
                                    label="second radio"
                                    name="formHorizontalRadios"
                                    id="formHorizontalRadios2"
                                />
                            </Col>
                        </Form.Group>
                    </fieldset>
                    <Form.Group as={Row} controlId="formHorizontalCheck">
                        <Col sm={{ span: 10, offset: 2 }} >
                            <Form.Check inline label="Remember me" />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Col sm={{ span: 10, offset: 2 }}>
                            <Button type="submit" size="lg" className="my-4">Register</Button>
                        </Col>
                    </Form.Group>
                </Form>
            </Container>
        </main>

       /* <form className="Register">
            <div className="form-control">
                <label>Username</label>
                <input type="text" onChange={this.usernameOnChangeHandler} />
                {usernameError && <div className="error">{usernameError}</div>}
            </div>
            <div className="form-control">
                <label>Password</label>
                <input type="password" onChange={this.passwordOnChangeHandler} />
                {passwordError && <div className="error">{passwordError}</div>}
            </div>
            <div className="form-control">
                <label>Re-Password</label>
                <input type="password" onChange={this.rePasswordOnChangeHandler} />
                {rePasswordError && <div className="error">{rePasswordError}</div>}
            </div>
            <div className="form-control">
                <button type="button" onClick={this.submitHandler}>Register</button>
            </div>
        </form>;*/
    }
}

const initialFormState = {
    username: '',
    password: '',
    rePassword: ''
};

const schema = yup.object({
    username: yup.string('Username should be a string')
        .required('Username is required')
        .min(4, 'Username should be more than 4 chars'),

    password: yup.string('Password must be a string')
        .required('Password is required')
        .min(6, 'Password must be more than 6 chars'),

    rePassword: yup.string('Password must be a string')
    // .oneOf([yup.ref('password'), ''], 'Passwords don\'t match')
    // .required('Password is required')
    // .min(6, 'Password must be more than 6 chars')
});


export default withForm(Register, initialFormState, schema)