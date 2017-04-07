import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import $ from "jquery";

export default class LoginForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {errorText: '', action: 'login'};
  };

  render() {
    if(this.state.action === 'login') {
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
    else {
      return (
      <form>
        <TextField type="text" name="registerusername" hintText="user name"
          errorText = {this.state.errorText}
          ref={
            (e) => {
              this._registerusername = e
            }
          }
        />
        <br />
        <TextField type="password" name="registerpassword" hintText="password"
          errorText = {this.state.errorText}
          ref={
            (e) => {
              this._registerpassword = e
            }
          }
        />
        <br />
        <TextField type="text" name="registeremail" hintText="email address"
          onKeyPress={this.onKeyPress.bind(this)}
          errorText = {this.state.errorText}
          ref={
            (e) => {
              this._registeremail = e
            }
          }
        />
        <br />
        <FlatButton label="register" onTouchTap={this.register.bind(this)} primary={true} />
      </form>
      )
    }
  };

  onKeyPress(e) {
    if(e.charCode === 13) {
      if(this.state.action === 'login') {
        this.login(e);
      }
      else if(this.state.action === 'register') {
        this.register(e);
      }
    }
  };

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
      self.setState({errorText: "wrong username or password"});
    });
  };

  toRegister() {
    this.setState({action: "register"});
  };

  register(e) {
    var data = {
      username: this._registerusername.input.value,
      password: this._registerpassword.input.value,
      email: this._registeremail.input.value
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
      self.setState({errorText: "register error"});
    });
  };

};
