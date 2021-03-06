import { Formik } from 'formik';
import { navigate } from '@reach/router';
import { toaster } from 'evergreen-ui';
import React from 'react';
import * as Yup from 'yup';

import { post } from '../utils/fetchUtils';
import SignUpForm from './SignUpForm';

export const INITIAL_STATUS = 'initial_status';
export const LOADING_STATUS = 'loading_status';
export const SUCCESS_STATUS = 'success_status';
export const FAILED_STATUS = 'failed_status';

class SignUpContainer extends React.Component {
  state = {
    status: INITIAL_STATUS,
    message: null,
  };

  setLoadingStatus = () => {
    this.setState({ status: LOADING_STATUS, message: null });
  };

  setSuccessStatus = () => {
    this.setState({ status: SUCCESS_STATUS });
  };

  setFailedStatus = ({ message }) => {
    this.setState({ status: FAILED_STATUS, message: message || 'Failure!' });
  };

  render() {
    return (
      <Formik
        initialValues={{ email: '', password: '', passwordConfirmation: '' }}
        validationSchema={Yup.object().shape({
          email: Yup.string().label('Email').required(),
          password: Yup.string().label('Password').required(),
          passwordConfirmation: Yup.string()
            .label('Password Confirmation')
            .oneOf([Yup.ref('password'), null], 'Passwords must match'),
        })}
        onSubmit={(values, { setSubmitting }) => {
          this.setLoadingStatus();

          post({
            endpoint: '/api/sign_up',
            body: {
              email: values.email,
              password: values.password,
              password_confirmation: values.passwordConfirmation,
            },
          }).then(json => {
            if (json.success) {
              this.setSuccessStatus();
              toaster.success(json.message || 'Success!');
              navigate('/');
            } else {
              this.setFailedStatus({ message: json.message });
            }

            setSubmitting(false);
          });
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) =>
          <SignUpForm
            values={values}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            errors={errors}
            touched={touched}
            status={this.state.status}
            message={this.state.message}
          />}
      </Formik>
    );
  }
}

export default SignUpContainer;
