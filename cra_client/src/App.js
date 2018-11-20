import React, { Component } from 'react';
import {
  Pane,
  TextInputField,
  Button,
  Alert,
  Tab,
  TabNavigation,
  Heading,
  Text,
} from 'evergreen-ui';
import { Router, Link, Location } from '@reach/router';
import { Formik } from 'formik';
import * as Yup from 'yup';

import './css/base.css';

const SectionHeading = ({ children, ...props }) => {
  return (
    <Heading size={700} paddingBottom="1rem" {...props}>
      {children}
    </Heading>
  );
};

const ExactNavLink = props =>
  <Location>
    {({ location }) => {
      const isSelected = location.pathname === props.to;

      return (
        <Tab isSelected={isSelected}>
          <Link
            {...props}
            style={{
              color: isSelected ? 'rgb(16, 112, 202)' : 'rgb(66, 90, 112)',
              textDecoration: 'none',
            }}
          />
        </Tab>
      );
    }}
  </Location>;

const Header = () => {
  return (
    <Pane
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      padding="1rem"
    >
      <Heading is="h1" size={900}>
        Sidecar
      </Heading>
      <TabNavigation>
        <ExactNavLink to="/">Home</ExactNavLink>
        <ExactNavLink to="/sign-in">Sign In</ExactNavLink>
        <ExactNavLink to="/sign-up">Sign Up</ExactNavLink>
      </TabNavigation>
    </Pane>
  );
};

const Home = () => {
  return <Text>Welcome, you are home!</Text>;
};

class SignUpContainer extends React.Component {
  state = {
    success: null,
    message: null,
  };

  updateSuccessState = ({ success, message }) => {
    this.setState({ success, message });
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
          fetch('/api/sign_up', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: values.email,
              password: values.password,
              password_confirmation: values.passwordConfirmation,
            }),
          })
            .then(response => {
              return response.json();
            })
            .then(json => {
              this.updateSuccessState({
                success: json.success,
                message: json.message,
              });
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
          <SignUp
            values={values}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            errors={errors}
            touched={touched}
            success={this.state.success}
            message={this.state.message}
          />}
      </Formik>
    );
  }
}

const SignUp = ({
  onSubmit,
  onChange,
  values,
  isSubmitting,
  errors,
  touched,
  success,
  message,
}) => {
  const signUpSucceeded = success === true;
  const signUpSuccessMessage = message || 'Success!';

  const signUpFailed = success === false;
  const signUpFailedMessage = message || 'Failure!';

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
        {signUpSucceeded &&
          <Alert
            appearance="card"
            intent="success"
            title={signUpSuccessMessage}
            marginBottom={32}
          />}
        {signUpFailed &&
          <Alert
            appearance="card"
            intent="danger"
            title={signUpFailedMessage}
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
        >
          Sign Up
        </Button>
      </Pane>
    </form>
  );
};

class SignIn extends Component {
  checkPassword = ({ email, password }) => {
    fetch('/api/check_password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        this.setState({ passwordCheck: !!json['valid_pass'] });
      })
      .catch(err => {
        alert('Something went wrong!');
        console.log(err);
      });
  };

  state = {
    email: '',
    password: '',
    passwordCheck: null,
  };

  handleSubmit = e => {
    e.preventDefault();

    this.checkPassword({
      email: this.state.email,
      password: this.state.password,
    });
  };

  handleEmailChange = e => {
    this.setState({ email: e.target.value });
  };

  handlePasswordChange = e => {
    this.setState({ password: e.target.value });
  };

  render() {
    const passwordCheckSucceeded =
      this.state.passwordCheck !== null && this.state.passwordCheck;
    const passwordCheckFailed =
      this.state.passwordCheck !== null && !this.state.passwordCheck;

    return (
      <form onSubmit={this.handleSubmit}>
        <Pane display="flex" flexDirection="column" width="280px">
          <SectionHeading>Sign In</SectionHeading>
          {passwordCheckSucceeded &&
            <Alert
              appearance="card"
              intent="success"
              title="Your password is correct"
              marginBottom={32}
            />}
          {passwordCheckFailed &&
            <Alert
              appearance="card"
              intent="danger"
              title="Your password is incorrect"
              marginBottom={32}
            />}
          <TextInputField
            label="Email"
            type="text"
            name="email"
            onChange={this.handleEmailChange}
            value={this.state.email}
          />
          <TextInputField
            label="Password"
            type="password"
            name="password"
            onChange={this.handlePasswordChange}
            value={this.state.password}
          />
          <Button
            intent="default"
            type="submit"
            onClick={this.handleSubmit}
            justifyContent="center"
          >
            Check Password
          </Button>
        </Pane>
      </form>
    );
  }
}

const App = () => {
  return (
    <Pane>
      <Header />
      <Pane
        className="base-background"
        display="flex"
        justifyContent="center"
        width="100%"
        padding="1rem"
        height="100%"
      >
        <Pane
          elevation={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
          maxWidth="540px"
          width="100%"
          background="#fff"
          padding="2rem"
          borderRadius="0.5rem"
        >
          <Router>
            <Home path="/" />
            <SignIn path="/sign-in" />
            <SignUpContainer path="/sign-up" />
          </Router>
        </Pane>
      </Pane>
    </Pane>
  );
};

export default App;
