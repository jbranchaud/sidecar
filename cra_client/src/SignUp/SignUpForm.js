import { Alert, Button, Pane, TextInputField } from 'evergreen-ui';
import React from 'react';

import { SUCCESS_STATUS, FAILED_STATUS } from './';
import SectionHeading from '../components/SectionHeading';

const SignUpForm = ({
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
        <SectionHeading>Sign Up</SectionHeading>
        {status === FAILED_STATUS &&
          <Alert
            appearance="card"
            intent="danger"
            title={message}
            marginBottom={32}
          />}
        <TextInputField
          label="Email"
          type="text"
          name="email"
          onChange={onChange}
          value={values.email}
          isInvalid={emailIsInvalid}
          validationMessage={emailValidationMessage}
        />
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
          disabled={isSubmitting}
        >
          Sign Up
        </Button>
      </Pane>
    </form>
  );
};

export default SignUpForm;
