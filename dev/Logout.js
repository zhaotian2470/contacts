import React from 'react';
import $ from "jquery";

export default class Logout extends React.Component {

  componentDidMount() {
    this.logout();
  }

  render() {
    return null;
  }

  logout() {
    $.ajax({
      type: 'GET',
      url: '/api/logout'
    }).done(function() {
      window.location.href = "/view/login.html";
    }).fail(function() {
      console.error("logout error");
    });
  }
}
