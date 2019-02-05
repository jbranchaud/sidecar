import { navigate } from '@reach/router';
import React from 'react';

import { destroyAuthToken } from './utils/authentication';

class SignOut extends React.Component {
  componentDidMount() {
    destroyAuthToken();
    navigate('/');
  }

  render() {
    return null;
  }
}

export default SignOut;
