import './css/base.css';

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
import { Router, Link, Location, navigate } from '@reach/router';
import React, { Component } from 'react';

import SectionHeading from './components/SectionHeading';
import SignUp from './SignUp';

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
      background="white"
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

class Home extends React.Component {
  state = {
    loading: true,
    data: {},
  };

  componentDidMount() {
    const authToken = localStorage.getItem('auth_token');

    if (authToken) {
      fetch('/api/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authToken,
        },
      })
        .then(response => {
          return response.json();
        })
        .then(json => {
          this.setState({ loading: false, data: { email: json.email } });
        })
        .catch(err => {
          console.log(err);
          this.setState({ loading: false });
        });
    } else {
      this.setState({ loading: false });
    }
  }

  render() {
    if (this.state.loading) {
      return <Text>Loading...</Text>;
    } else {
      if (this.state.data.email) {
        return (
          <Text>
            Welcome, {this.state.data.email}! You are home.
          </Text>
        );
      } else {
        return (
          <Text>
            Welcome, <Link to={'/sign-in'}>click here</Link> to sign in!
          </Text>
        );
      }
    }
  }
}

class SignIn extends Component {
  signIn = ({ email, password }) => {
    fetch('/api/sign_in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then(response => {
        localStorage.setItem(
          'auth_token',
          response.headers.get('Authorization')
        );
        return response.json();
      })
      .then(json => {
        this.setState({ passwordCheck: !!json['valid_pass'] });
        navigate('/');
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

    this.signIn({
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
          borderRadius="0.25rem"
        >
          <Router>
            <Home path="/" />
            <SignIn path="/sign-in" />
            <SignUp path="/sign-up" />
          </Router>
        </Pane>
      </Pane>
    </Pane>
  );
};

export default App;
