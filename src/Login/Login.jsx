import React from 'react';
import * as yup from 'yup';
import '../shared/styles/LoginAndRegister.css';
import { StoreContext } from '../Store/Store';
//import { useHistory } from 'react-router-dom';
import { login } from '../Store/actions';

import { useFormControl, getValidationsRunnerForSchema } from '../shared/hocs/withForm';
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

const validations = {
    username: yup.string()
        .required('Username is required')
        .min(4, 'Username should be more than 4 chars'),

    password: yup.string()
        .required('Password is required')
        .min(6, 'Password must be more than 6 chars')
};

const schema = yup.object().shape(validations);

const validationsRunner = getValidationsRunnerForSchema(schema);

const Login = () => {
    const { state, dispatch } = React.useContext(StoreContext);
    // const history = useHistory();
    const usernameFormControl = useFormControl('', validations.username);
    const passwordFormControl = useFormControl('', validations.password);

    // React.useEffect(() => {
    //   if (!!state.user) { history.push('/'); }
    // }, [state.user, history]);

    const submitHandler = React.useCallback(() => {
        validationsRunner({
            username: usernameFormControl.value,
            password: passwordFormControl.value
        }).then(data => {
            dispatch(login(data));
        }).catch(errors => {
            if (errors.username) { usernameFormControl.setErrors(errors.username); }
            if (errors.password) { passwordFormControl.setErrors(errors.password); }
        })
    }, [usernameFormControl, passwordFormControl, dispatch]);

    return <main className="my-5 py-5">
        <Container className="px-0 col-xl-4">
            <Form>
                <Form.Group as={Row} controlId="username">
                    <Form.Label column sm={2}>
                        Username
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control size="lg" type="text" placeholder="Username"
                                      onChange={usernameFormControl.changeHandler} />
                    </Col>
                    {usernameFormControl.errors && usernameFormControl.errors[0]}
                </Form.Group>

                <Form.Group as={Row} controlId="password">
                    <Form.Label column sm={2}>
                        Password
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control size="lg" type="password" placeholder="Password"
                                      onChange={passwordFormControl.changeHandler}/>
                    </Col>
                    {passwordFormControl.errors && passwordFormControl.errors[0]}
                </Form.Group>

                <Form.Group as={Row} controlId="rememberMe">
                    <Col sm={{ span: 10, offset: 2 }} >
                        <Form.Check inline label="Remember me" />
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Col sm={{ span: 10, offset: 2 }}>
                        <Button type="button" onClick={submitHandler} size="lg" className="my-4">Login</Button>
                    </Col>
                </Form.Group>
            </Form>
        </Container>
    </main>

    /*<form className="Login">
        <div className="form-control">
            <label>Username</label>
            <input type="text" onChange={usernameFormControl.changeHandler} />
        </div>
        {usernameFormControl.errors && usernameFormControl.errors[0]}
        <div className="form-control">
            <label>Password</label>
            <input type="password" onChange={passwordFormControl.changeHandler} />
        </div>
        {passwordFormControl.errors && passwordFormControl.errors[0]}
        {state.error && state.error}
        <div className="form-control">
            <button type="button" onClick={submitHandler}>Login</button>
        </div>
    </form>;*/
};

export default Login;

// class Login extends React.Component {

//   state = { error: null };

//   usernameChangeHandler = this.props.controlChangeHandlerFactory('username');
//   passwordChangeHandler = this.props.controlChangeHandlerFactory('password');

//   submitHandler = () => {
//     const errors = this.props.getFormErrorState();
//     if (!!errors) { return; }
//     const data = this.props.getFormState();
//     this.props.login(this.props.history, data).catch(error => {
//       this.setState({ error });
//     });
//   }

//   render() {
//     const { error } = this.state;
//     return <form className="Login">
//       <div className="form-control">
//         <label>Username</label>
//         <input type="text" onChange={this.usernameChangeHandler} />
//       </div>
//       <div className="form-control">
//         <label>Password</label>
//         <input type="password" onChange={this.passwordChangeHandler} />
//       </div>
//       {error && error}
//       <div className="form-control">
//         <button type="button" onClick={this.submitHandler}>Login</button>
//       </div>
//     </form>;
//   }
// }

// export default withForm(Login, { username: '', password: '' });