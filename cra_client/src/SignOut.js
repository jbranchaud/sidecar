import { navigate } from '@reach/router';
import React from 'react';

import { destroyAuthToken } from './utils/authentication';
import AuthenticationContext from './AuthenticationContext';

class SignOut extends React.Component {
  componentDidMount() {
    destroyAuthToken();
    this.props.updateAuthToken(null);
    navigate('/');
  }

  render() {
    return null;
  }
}

export default props => {
  return (
    <AuthenticationContext.Consumer>
      {({ updateAuthToken }) =>
        <SignOut updateAuthToken={updateAuthToken} {...props} />}
    </AuthenticationContext.Consumer>
  );
};
