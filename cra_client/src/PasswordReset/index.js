import { Button, Pane, TextInputField, toaster } from 'evergreen-ui';
import { Formik } from 'formik';
import { navigate } from '@reach/router';
import React from 'react';
import * as Yup from 'yup';

import { put } from '../utils/fetchUtils';
import SectionHeading from '../components/SectionHeading';

export const INITIAL_STATUS = 'initial_status';
export const LOADING_STATUS = 'loading_status';
export const SUCCESS_STATUS = 'success_status';
export const FAILED_STATUS = 'failed_status';

class PasswordResetContainer extends React.Component {
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
        initialValues={{ password: '', passwordConfirmation: '' }}
        validationSchema={Yup.object().shape({
          password: Yup.string().label('Password').required(),
          passwordConfirmation: Yup.string()
            .required()
            .label('Password Confirmation')
            .oneOf([Yup.ref('password'), null], 'Passwords must match'),
        })}
        onSubmit={(values, { setSubmitting }) => {
          this.setLoadingStatus();

          put({
            endpoint: '/api/reset_password',
            body: {
              reset_token: this.props['reset-token'],
              password: values.password,
              password_confirm: values.passwordConfirmation,
            },
          })
            .then(json => {
              this.setSuccessStatus();
              toaster.success('Password reset!');
              navigate('/');

              setSubmitting(false);
            })
            .catch(err => {
              this.setFailedStatus({ message: err.message });
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
          <PasswordResetForm
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

const PasswordResetForm = ({
  values,
  onChange,
  onSubmit,
  isSubmitting,
  errors,
  touched,
  status,
  message,
}) => {
  const passwordIsInvalid = !!(errors['password'] && touched['password']);
  const passwordValidationMessage = passwordIsInvalid
    ? errors['password']
    : null;

  const passwordConfirmationIsInvalid = !!(
    errors['passwordConfirmation'] && touched['passwordConfirmation']
  );
  const passwordConfirmationValidationMessage = passwordConfirmationIsInvalid
    ? errors['passwordConfirmation']
    : null;

  return (
    <form onSubmit={onSubmit}>
      <Pane display="flex" flexDirection="column" width="280px">
        <SectionHeading>Reset Password</SectionHeading>
        <TextInputField
          label="Password"
          type="password"
          name="password"
          onChange={onChange}
          value={values.password}
          isInvalid={passwordIsInvalid}
          validationMessage={passwordValidationMessage}
        />
        <TextInputField
          label="Password Confirmation"
          type="password"
          name="passwordConfirmation"
          onChange={onChange}
          value={values.passwordConfirmation}
          isInvalid={passwordConfirmationIsInvalid}
          validationMessage={passwordConfirmationValidationMessage}
        />
        <Button
          intent="default"
          type="submit"
          onClick={onSubmit}
          justifyContent="center"
        >
          Reset Password
        </Button>
      </Pane>
    </form>
  );
};

export default PasswordResetContainer;
