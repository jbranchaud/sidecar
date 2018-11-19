import React, { Component } from 'react';
import { Pane, TextInputField, Button, Alert } from 'evergreen-ui';

const Home = () => {
  return (
    <div>
      <h1>Sidecar</h1>
    </div>
  );
};

class App extends Component {
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
      <Pane padding="1rem">
        <Home />
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
      </Pane>
    );
  }
}

export default App;
