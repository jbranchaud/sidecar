import './css/base.css';

import { Heading, Pane, Tab, TabNavigation, Text } from 'evergreen-ui';
import { Router, Link, Location } from '@reach/router';
import React from 'react';

import { get } from './utils/fetchUtils';
import { getAuthToken } from './utils/authentication';
import AuthenticationContext, {
  AuthenticationProvider,
} from './AuthenticationContext';
import CreateRecipe from './Recipe/CreateRecipe';
import RecipeListing from './Recipe/RecipeListing';
import SignIn from './SignIn';
import SignOut from './SignOut';
import SignUp from './SignUp';
import UpdateRecipe from './Recipe/UpdateRecipe';

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
    <AuthenticationContext.Consumer>
      {({ isAuthenticated }) =>
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
            {!isAuthenticated &&
              <React.Fragment>
                <ExactNavLink to="/sign-in">Sign In</ExactNavLink>
                <ExactNavLink to="/sign-up">Sign Up</ExactNavLink>
              </React.Fragment>}
            {isAuthenticated &&
              <React.Fragment>
                <ExactNavLink to="/sign-out">Sign Out</ExactNavLink>
              </React.Fragment>}
          </TabNavigation>
        </Pane>}
    </AuthenticationContext.Consumer>
  );
};

class Home extends React.Component {
  state = {
    loading: true,
    loadingRecipes: true,
    data: {},
    recipes: [],
  };

  componentDidMount() {
    const authToken = getAuthToken();

    if (authToken) {
      get({ endpoint: '/api/user' })
        .then(json => {
          this.setState({ loading: false, data: { email: json.email } });
        })
        .catch(err => {
          console.log(err);
          this.setState({ loading: false });
        });

      get({ endpoint: '/api/recipes' })
        .then(json => {
          this.setState({ loadingRecipes: false, recipes: json.data });
        })
        .catch(err => {
          this.setState({ loadingRecipes: false });
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
          <React.Fragment>
            <Text>
              Welcome, {this.state.data.email}! You are home.
            </Text>
            <Text>
              Want to <Link to="/recipe/new">create a new recipe</Link>?
            </Text>
            {!!this.state.recipes.length &&
              <RecipeListing recipes={this.state.recipes} />}
          </React.Fragment>
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
    <AuthenticationProvider>
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
              <CreateRecipe path="/recipe/new" />
              <UpdateRecipe path="/recipe/:id/edit" />
            </Router>
          </Pane>
        </Pane>
      </Pane>
    </AuthenticationProvider>
  );
};

export default App;
