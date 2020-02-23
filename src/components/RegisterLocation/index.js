import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import styled from '@emotion/styled';
import "./RegisterLocation.module.css";

const MyTextInput = ({ label, ...props }) => {
    // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
    // which we can spread on <input> and also replace ErrorMessage entirely.
    const [field, meta] = useField(props);
    return (
        <>
            <StyledLabel htmlFor={props.id || props.name}>{label}</StyledLabel>
            <input className="text-input" {...field} {...props} />
            {meta.touched && meta.error ? (
                <StyledErrorMessage>{meta.error}</StyledErrorMessage>
            ) : null}
        </>
    );
};

const MyTextarea = ({ label, ...props }) => {
    // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
    // which we can spread on <input> and also replace ErrorMessage entirely.
    const [field, meta] = useField(props);
    return (
        <>
            <StyledLabel htmlFor={props.id || props.name}>{label}</StyledLabel>
            <textarea className="text-input" {...field} {...props} rows={5}> </textarea>
            {meta.touched && meta.error ? (
                <StyledErrorMessage>{meta.error}</StyledErrorMessage>
            ) : null}
        </>
    );
};

// Styled components ....
const StyledErrorMessage = styled.div`
  font-size: 12px;
  color: var(--red-600);
  width: 400px;
  margin: auto;
  margin-top: 0.25rem;
  text-align: left;
  &:before {
    content: "❌ ";
    font-size: 10px;
  }
  @media (prefers-color-scheme: dark) {
    color: var(--red-300);
  }
`;

const StyledLabel = styled.label`
  margin-top: 1rem;
  width: 400px;
  margin: auto;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  display: block;
`;

// And now we can use these
const RegisterLocationPage = () => (
    <div>
        <h1>Register a location</h1>
        <RegisterLocationForm />
    </div>
);

const error = null;

class RegisterLocationFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...error };
    };

    render() {
        return (
        <>
            <Formik
                initialValues={{
                    title: '',
                    latitude: '',
                    longitude: '',
                    description: '',
                }}
                validationSchema={Yup.object({
                    title: Yup
                        .string('Title should be text')
                        .required('Title is required'),
                    latitude: Yup
                        .number('Latitude should be number')
                        .min(-90, 'Minimum value of latitude cannot be less than -90')
                        .max(90, 'Maximum value of latitude cannot be more than 90')
                        .required('Latitude is required'),
                    longitude: Yup
                        .number('Longitude should be number')
                        .min(-180, 'Minimum value of longitude cannot be less than -180')
                        .max(180, 'Maximum value of longitude cannot be more than 180')
                        .required('Longitude is required'),
                    description: Yup
                        .string('Description should be text')
                        .min(10, 'Description should be more than 10 chars'),
                })}
                onSubmit={(values, {setSubmitting}) => {
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2));
                        setSubmitting(false);
                    }, 400);
                    /*  this.props.firebase
                           .locations().push({
                           title: title,
                           latitude: latitude,
                           longitude: longitude,
                           description: description,
                           })
                           .then(() => {
                               console.log('test 2');
                               this.setState({ ...INITIAL_STATE });
                               this.props.history.push({
                                   pathname: ROUTES.ADMIN,
                                   state: { isSent: true }
                               });
                           })
                           .catch(error => {
                               console.log('test 3');
                               this.setState({ error });
                           });*/
                }}
            >

                <Form style={{
                    textAlign: "center",
                }}>
                    <MyTextInput
                        label="Title"
                        name="title"
                        type="text"
                        placeholder="Name of location"
                    />
                    <MyTextInput
                        label="Latitude"
                        name="latitude"
                        type="number"
                        placeholder="Latitude coordinates"
                    />
                    <MyTextInput
                        label="Longitude"
                        name="longitude"
                        type="number"
                        placeholder="Longitude coordinates"
                    />
                    <MyTextarea
                        label="Description"
                        name="description"
                        type="text"
                        placeholder="Enter description"
                    />

                    <div>
                        <button type="submit">Submit</button>
                    </div>

                    {error && <p>{error.message}</p>}
                </Form>
            </Formik>
        </>
        )
    };
}

const RegisterLocationLink = () => (
    <p>
        Add a new location on the map? <Link to={ROUTES.ADMIN_LOCATIONS_NEW}>Register location</Link>
    </p>
);

const RegisterLocationForm = compose(
    withRouter,
    withFirebase,
)(RegisterLocationFormBase);

export default RegisterLocationPage;
export { RegisterLocationForm, RegisterLocationLink };