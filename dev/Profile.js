import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import $ from "jquery";

export default class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      _id: '',
      errorText: ''
    };
  }

  componentDidMount() {
    this.getProfile();
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
          error={Boolean(this.state.errorText)}
          inputRef={(el) => { this._passwordInput = el; }}
        />
        <br />
        <TextField
          type="text"
          name="email"
          label="Email"
          error={Boolean(this.state.errorText)}
          inputRef={(el) => { this._emailInput = el; }}
        />
        <br />
        <Button onClick={this.saveProfile.bind(this)} color="primary">save profile</Button>
      </form>
    );
  }

  getProfile() {
    var self = this;
    $.ajax({
      type: 'GET',
      url: '/api/profile'
    }).done(function(data) {
      self.setState({ "_id": data.res._id });
      self._usernameInput.value = data.res.username;
      self._passwordInput.value = data.res.password;
      self._emailInput.value = data.res.email;
    }).fail(function(jqXhr) {
      if (jqXhr.status === 403) {
        window.location.href = "/view/login.html";
      } else {
        console.error("get profile error: " + jqXhr.responseJSON.message);
        self.setState({ errorText: jqXhr.responseJSON.message });
      }
    });
  }

  saveProfile() {
    var self = this;
    var data = {
      _id: self.state._id,
      username: self._usernameInput.value,
      password: self._passwordInput.value,
      email: self._emailInput.value
    };
    $.ajax({
      type: 'POST',
      url: '/api/profile',
      data: data
    }).done(function() {
      window.location.href = "/view/index.html";
    }).fail(function(jqXhr) {
      console.error("save profile error: " + jqXhr.responseJSON.message);
      self.setState({ errorText: jqXhr.responseJSON.message });
    });
  }
}
