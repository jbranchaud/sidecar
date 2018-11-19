import React, { Component } from 'react';
import {
  Pane,
  TextInputField,
  Button,
  Alert,
  Tab,
  TabNavigation,
} from 'evergreen-ui';
import { Router, Link, Location } from '@reach/router';
import { Formik } from 'formik';
import * as Yup from 'yup';

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
    <Pane>
      <TabNavigation>
        <ExactNavLink to="/">Home</ExactNavLink>
        <ExactNavLink to="/sign-in">Sign In</ExactNavLink>
        <ExactNavLink to="/sign-up">Sign Up</ExactNavLink>
      </TabNavigation>
      <h1>Sidecar</h1>
    </Pane>
  );
};

const Home = () => {
  return <p>Welcome, you are home!</p>;
};

const SignUpContainer = () => {
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
        // submit data to sign up endpoint
        // if it comes back successfully, show 'You signed up!'
        // if it comes back with a failure, show specific message
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
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
        />}
    </Formik>
  );
};

const SignUp = ({
  onSubmit,
  onChange,
  values,
  isSubmitting,
  errors,
  touched,
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
        {/*passwordCheckSucceeded &&
            <Alert
              appearance="card"
              intent="success"
              title="Your password is correct"
              marginBottom={32}
            />*/}
        {/*passwordCheckFailed &&
            <Alert
              appearance="card"
              intent="danger"
              title="Your password is incorrect"
              marginBottom={32}
            />*/}
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
    <Pane padding="1rem">
      <Header />
      <Router>
        <Home path="/" />
        <SignIn path="/sign-in" />
        <SignUpContainer path="/sign-up" />
      </Router>
    </Pane>
  );
};

export default App;
