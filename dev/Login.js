import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import $ from "jquery";

class LoginForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = { errorText: '' };
  }

  render() {
    return (
      <form>
        <TextField
          type="text"
          name="username"
          label="Username"
          error={Boolean(this.state.errorText)}
          helperText={this.state.errorText}
          inputRef={(el) => { this._usernameInput = el; }}
        />
        <br />
        <TextField
          type="password"
          name="password"
          label="Password"
          onKeyPress={this.onKeyPress.bind(this)}
          error={Boolean(this.state.errorText)}
          inputRef={(el) => { this._passwordInput = el; }}
        />
        <br />
        <Button onClick={this.login.bind(this)} color="primary">login</Button>
        <Button onClick={this.toRegister.bind(this)} color="primary">register</Button>
      </form>
    );
  }

  onKeyPress(e) {
    if (e.charCode === 13) {
      this.login(e);
    }
  }

  toRegister() {
    this.props.toRegister();
  }

  login(e) {
    var data = {
      username: this._usernameInput.value,
      password: this._passwordInput.value
    };

    var self = this;
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/api/login',
      data: data
    }).done(function() {
      self.setState({ errorText: "" });
      window.location.href = "/view/index.html";
    }).fail(function(jqXhr) {
      self.setState({ errorText: jqXhr.responseJSON.message });
    });
  }
}

class RegisterForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = { errorText: '' };
  }

  render() {
    return (
      <form>
        <TextField
          type="text"
          name="username"
          label="User name"
          error={Boolean(this.state.errorText)}
          helperText={this.state.errorText}
          inputRef={(el) => { this._usernameInput = el; }}
        />
        <br />
        <TextField
          type="password"
          name="password"
          label="Password"
          error={Boolean(this.state.errorText)}
          inputRef={(el) => { this._passwordInput = el; }}
        />
        <br />
        <TextField
          type="text"
          name="email"
          label="Email address"
          onKeyPress={this.onKeyPress.bind(this)}
          error={Boolean(this.state.errorText)}
          inputRef={(el) => { this._emailInput = el; }}
        />
        <br />
        <Button onClick={this.register.bind(this)} color="primary">register</Button>
      </form>
    );
  }

  onKeyPress(e) {
    if (e.charCode === 13) {
      this.register(e);
    }
  }

  register(e) {
    var data = {
      username: this._usernameInput.value,
      password: this._passwordInput.value,
      email: this._emailInput.value
    };

    var self = this;
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/api/register',
      data: data
    }).done(function() {
      self.setState({ errorText: "" });
      window.location.href = "/view/login.html";
    }).fail(function(jqXhr) {
      self.setState({ errorText: jqXhr.responseJSON.message });
    });
  }
}

export default class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = { action: 'login' };
  }

  render() {
    if (this.state.action === 'login') {
      return (<LoginForm toRegister={this.toRegister.bind(this)} />);
    } else {
      return (<RegisterForm />);
    }
  }

  toRegister() {
    this.setState({ action: "register" });
  }
}
