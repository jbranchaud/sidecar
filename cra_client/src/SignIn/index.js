import { Alert, Button, Pane, TextInputField } from 'evergreen-ui';
import { Link, navigate } from '@reach/router';
import React from 'react';

import { post } from '../utils/fetchUtils';
import SectionHeading from '../components/SectionHeading';

export const INITIAL_STATUS = 'initial_status';
export const LOADING_STATUS = 'loading_status';
export const FAILED_STATUS = 'failed_status';

class SignIn extends React.Component {
  state = {
    status: INITIAL_STATUS,
    message: null,
    email: '',
    password: '',
  };

  setLoadingStatus = () => {
    this.setState({ status: LOADING_STATUS, message: null });
  };

  setFailedStatus = ({ message }) => {
    this.setState({ status: FAILED_STATUS, message: message || 'Failure!' });
  };

  signIn = ({ email, password }) => {
    this.setLoadingStatus();

    post({
      endpoint: '/api/sign_in',
      body: {
        email,
        password,
      },
    })
      .then(json => {
        if (json.error) {
          this.setFailedStatus({ message: json.error });
        } else {
          navigate('/');
        }
      })
      .catch(err => {
        this.setFailedStatus({ message: 'Something went wrong!' });
        console.log(err);
      });
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
    return (
      <form onSubmit={this.handleSubmit}>
        <Pane display="flex" flexDirection="column" width="280px">
          <SectionHeading>Sign In</SectionHeading>
          {this.state.status === FAILED_STATUS &&
            <Alert
              appearance="card"
              intent="danger"
              title={this.state.message}
              marginBottom={32}
            />}
          <TextInputField
            label="Email"
            type="text"
            name="email"
            onChange={this.handleEmailChange}
            value={this.state.email}
            disabled={this.state.status === LOADING_STATUS}
          />
          <TextInputField
            label="Password"
            type="password"
            name="password"
            onChange={this.handlePasswordChange}
            value={this.state.password}
            disabled={this.state.status === LOADING_STATUS}
          />
          <Button
            intent="default"
            type="submit"
            onClick={this.handleSubmit}
            justifyContent="center"
            disabled={this.state.status === LOADING_STATUS}
          >
            Sign In
          </Button>
          <small>
            <Link to="/forgot-password">Forgot password?</Link>
          </small>
        </Pane>
      </form>
    );
  }
}

export default SignIn;
