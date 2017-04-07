import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import $ from "jquery";

class LoginForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {errorText: ''};
  };

  render() {
    return (
        <form>
          <TextField type="text" name="username" hintText="Username"
            errorText = {this.state.errorText}
            ref={
              (e) => {
                this._username = e
              }
            }
          />
          <br />
          <TextField type="password" name="password" hintText="Password"
            onKeyPress={this.onKeyPress.bind(this)}
            errorText = {this.state.errorText}
            ref={
              (e) => {
                this._password = e
              }
            }
          />
          <br />
          <FlatButton label="login" onTouchTap={this.login.bind(this)} primary={true} />
          <FlatButton label="register" onTouchTap={this.toRegister.bind(this)} primary={true} />
        </form>
      );
  }

  onKeyPress(e) {
    if(e.charCode === 13) {
      this.login(e);
    }
  };

  toRegister(e) {
    this.props.toRegister();
  }

  login(e) {
    var data = {
      username: this._username.input.value,
      password: this._password.input.value
    };

    var self = this;
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/api/login',
      data: data
    }).done(function(data) {
      self.setState({errorText: ""});
      window.location.href="/view/index.html";
    }).fail(function(jqXhr) {
      self.setState({errorText: jqXhr.responseJSON.message});
    });
  };
};

class RegisterForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {errorText: ''};
  };

  render() {
      return (
      <form>
        <TextField type="text" name="username" hintText="user name"
          errorText = {this.state.errorText}
          ref={
            (e) => {
              this._username = e
            }
          }
        />
        <br />
        <TextField type="password" name="password" hintText="password"
          errorText = {this.state.errorText}
          ref={
            (e) => {
              this._password = e
            }
          }
        />
        <br />
        <TextField type="text" name="email" hintText="email address"
          onKeyPress={this.onKeyPress.bind(this)}
          errorText = {this.state.errorText}
          ref={
            (e) => {
              this._email = e
            }
          }
        />
        <br />
        <FlatButton label="register" onTouchTap={this.register.bind(this)} primary={true} />
      </form>
      )
  };

  onKeyPress(e) {
    if(e.charCode === 13) {
        this.register(e);
    }
  };

  register(e) {
    var data = {
      username: this._username.input.value,
      password: this._password.input.value,
      email: this._email.input.value
    };

    var self = this;
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/api/register',
      data: data
    }).done(function(data) {
      self.setState({errorText: ""});
      window.location.href="/view/login.html";
    }).fail(function(jqXhr) {
      self.setState({errorText: jqXhr.responseJSON.message});
    });
  };

};

export default class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {action: 'login'};
  };

  render() {
    if(this.state.action === 'login') {
      return (<LoginForm toRegister={this.toRegister.bind(this)} />);
    }
    else {
      return (<RegisterForm />)
    }
  };

  toRegister() {
    this.setState({action: "register"});
  };

};
