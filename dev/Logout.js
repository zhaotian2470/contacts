import React from 'react';
import $ from "jquery";

export default class Logout extends React.Component {

  componentWillMount() {
    this.logout();
  };

  render() {
    return null;
  };

  logout() {
    var self = this;
    $.ajax({
      type: 'GET',
      url: '/api/logout'
    }).done(function(data) {
      window.location.href="/view/login.html";
    }).fail(function(jqXhr) {
      console.error("logout error");
    });
  };

};
