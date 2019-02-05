import './css/base.css';

import { Pane, Tab, TabNavigation, Heading, Text } from 'evergreen-ui';
import { Router, Link, Location } from '@reach/router';
import React from 'react';

import { getAuthToken, isAuthenticated } from './utils/authentication';
import SignIn from './SignIn';
import SignOut from './SignOut';
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
        {!isAuthenticated() &&
          <React.Fragment>
            <ExactNavLink to="/sign-in">Sign In</ExactNavLink>
            <ExactNavLink to="/sign-up">Sign Up</ExactNavLink>
          </React.Fragment>}
        {isAuthenticated() &&
          <React.Fragment>
            <ExactNavLink to="/sign-out">Sign Out</ExactNavLink>
          </React.Fragment>}
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
    const authToken = getAuthToken();

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
            <SignOut path="/sign-out" />
          </Router>
        </Pane>
      </Pane>
    </Pane>
  );
};

export default App;
