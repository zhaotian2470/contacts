import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import $ from "jquery";

export default class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      _id: '',
      errorText: ''
    };
  };

  componentDidMount() {
    this.getProfile();
  };

  render() {
    return (
      <form>
        <TextField type="text" name="username"
          errorText = {this.state.errorText}
          ref={
            (e) => {
              this._username = e
            }
          }
        />
        <br />
        <TextField type="password" name="password"
          errorText = {this.state.errorText}
          ref={
            (e) => {
              this._password = e
            }
          }
        />
        <br />
        <TextField type="text" name="email"
          errorText = {this.state.errorText}
          ref={
            (e) => {
              this._email = e
            }
          }
        />
        <br />
        <FlatButton label="save profile" onTouchTap={this.saveProfile.bind(this)} primary={true} />
      </form>
    );
  };

  getProfile() {
    var self = this;
    $.ajax({
      type: 'GET',
      url: '/api/profile'
    }).done(function(data) {
      self.setState({"_id": data.res._id});
      self._username.input.value = data.res.username;
      self._password.input.value = data.res.password;
      self._email.input.value = data.res.email;
    }).fail(function(jqXhr) {
      if(jqXhr.status === 403) {
        console.log("login before get profile");
        window.location.href="/view/login.html";
      }
      else {
        console.error("get profile error: " + jqXhr.responseJSON.message);
        self.setState({errorText: jqXhr.responseJSON.message});
      }
    });
  };
  
  saveProfile() {
    var self = this;
    var data = {
      _id: self.state._id,
      username: self._username.input.value,
      password: self._password.input.value,
      email: self._email.input.value
    };
    $.ajax({
      type: 'POST',
      url: '/api/profile',
      data: data
    }).done(function(data) {
      console.log("save profile success");
      window.location.href="/view/index.html";
    }).fail(function(jqXhr) {
      console.error("save profile error: " + jqXhr.responseJSON.message);
      self.setState({errorText: jqXhr.responseJSON.message});
    });
  };

  
};
