import { Button, Pane, TextInputField, toaster } from 'evergreen-ui';
import { Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';

import { post } from './utils/fetchUtils';
import SectionHeading from './components/SectionHeading';

const ForgotPasswordForm = ({
  onSubmit,
  onChange,
  values,
  isSubmitting,
  errors,
  touched,
  status,
  message,
}) => {
  const emailIsInvalid = !!(errors['email'] && touched['email']);
  const emailValidationMessage = emailIsInvalid ? errors['email'] : null;

  return (
    <form onSubmit={onSubmit}>
      <Pane display="flex" flexDirection="column" width="280px">
        <SectionHeading>Forgot Password?</SectionHeading>
        <p>Enter your email and we'll send you a password reset link.</p>
        <TextInputField
          label="Email"
          type="text"
          name="email"
          onChange={onChange}
          value={values.email}
          isInvalid={emailIsInvalid}
          validationMessage={emailValidationMessage}
        />
        <Button
          intent="default"
          type="submit"
          onClick={onSubmit}
          justifyContent="center"
          disabled={isSubmitting}
        >
          Submit
        </Button>
      </Pane>
    </form>
  );
};

class ForgotPassword extends React.Component {
  render() {
    return (
      <Formik
        initialValues={{ email: '' }}
        validationSchema={Yup.object().shape({
          email: Yup.string().label('Email').required(),
        })}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          post({
            endpoint: '/api/request_password_reset',
            body: {
              email: values.email,
            },
          }).then(json => {
            resetForm();
            toaster.success('Password reset email sent');

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
          <ForgotPasswordForm
            values={values}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            errors={errors}
            touched={touched}
          />}
      </Formik>
    );
  }
}

export default ForgotPassword;
