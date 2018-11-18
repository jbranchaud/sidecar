import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

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
        alert(json['valid_pass']);
      })
      .catch(err => {
        alert('Something went wrong!');
        console.log(err);
      });
  };

  state = {
    email: '',
    password: '',
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
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            onChange={this.handleEmailChange}
            value={this.state.email}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            onChange={this.handlePasswordChange}
            value={this.state.password}
          />
          <button type="submit" onClick={this.handleSubmit}>
            Check Password
          </button>
        </form>
      </div>
    );
  }
}

export default App;
