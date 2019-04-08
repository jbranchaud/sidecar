import { Button, Pane, TextInputField } from 'evergreen-ui';
import React from 'react';

import { put } from '../utils/fetchUtils';
import SectionHeading from '../components/SectionHeading';

class PasswordReset extends React.Component {
  state = {
    password: '',
    passwordConfirm: '',
  };

  onPasswordChange = e => {
    this.setState({ password: e.target.value });
  };

  onPasswordConfirmChange = e => {
    this.setState({ passwordConfirm: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();

    const { password, passwordConfirm } = this.state;
    const { 'reset-token': resetToken } = this.props;
    console.log({ resetToken, password, passwordConfirm });

    put({
      endpoint: '/api/update_password',
      body: {
        reset_token: resetToken,
        password,
        password_confirm: passwordConfirm,
      },
    })
      .then(json => {
        console.log(json);
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <form submit={this.handleSubmit}>
        <Pane display="flex" flexDirection="column" width="280px">
          <SectionHeading>Reset Password</SectionHeading>
          <TextInputField
            label="Password"
            type="password"
            name="password"
            onChange={this.onPasswordChange}
            value={this.state.password}
          />
          <TextInputField
            label="Password Confirmation"
            type="password"
            name="passwordConfirmation"
            onChange={this.onPasswordConfirmChange}
            value={this.state.passwordConfirm}
          />
          <Button
            intent="default"
            type="submit"
            onClick={this.handleSubmit}
            justifyContent="center"
          >
            Reset Password
          </Button>
        </Pane>
      </form>
    );
  }
}

export default PasswordReset;
