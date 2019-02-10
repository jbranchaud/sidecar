import React from 'react';

import { getAuthToken, setAuthToken } from './utils/authentication';

const AuthenticationContext = React.createContext({});

class AuthenticationProvider extends React.Component {
  state = {
    authToken: null,
  };

  componentDidMount() {
    this.checkAuthStatus();
  }

  updateAuthToken = authToken => {
    this.setState({ authToken }, () => {
      setAuthToken(authToken);
    });
  };

  checkAuthStatus = () => {
    const authToken = getAuthToken();
    if (authToken) {
      this.setState({ authToken });
    }
  };

  render() {
    return (
      <AuthenticationContext.Provider
        value={{
          isAuthenticated: !!this.state.authToken,
          authToken: this.state.authToken,
          updateAuthToken: this.updateAuthToken,
          checkAuthStatus: this.checkAuthStatus,
        }}
      >
        {this.props.children}
      </AuthenticationContext.Provider>
    );
  }
}

export { AuthenticationProvider };

export default AuthenticationContext;
