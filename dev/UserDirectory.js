import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import $ from "jquery";

export default class UserDirectory extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      _userDirectory: [],
      _currentRow: -1,
      _birthdayType: '阳历'
    };
  };

  componentDidMount() {
    this.getUserDirectory();
  };

  render() {

    if(this.state._currentRow > 0 || this.state._currentRow === -2) {
      var defaultName, defaultBirthday;
      if(this.state._currentRow > 0) {
        var currentDirectory = this.state._userDirectory[this.state._currentRow];
        defaultName = currentDirectory.name;
        defaultBirthday = new Date(currentDirectory.birthday);
      }
      else {
        defaultName = "";
        defaultBirthday = new Date();
      }

      return (
        <form>
          <TextField type="text" name="name" defaultValue={defaultName}
            ref={
              (e) => {
                this._name = e
              }
            }
          />
          <br />
          <DatePicker name="birthday" hintText="生日" defaultDate={defaultBirthday}
            ref={
              (e) => {
                this._birthday = e
              }
            }
          />
          <br />
          <SelectField name="birthdayType" value={this.state._birthdayType} onChange={this.handleBirthdayType.bind(this)} >
            <MenuItem value={"阳历"} primaryText="阳历" />
            <MenuItem value={"阴历"} primaryText="阴历" />
          </SelectField>
          <br />
          <FlatButton label="save" onTouchTap={this.saveRow.bind(this)} primary={true} />
          <FlatButton label="delete" onTouchTap={this.deleteRow.bind(this)} primary={true} />
          </form>
      );
    }

    var tableBodyArray = [];
    for(var i of this.state._userDirectory) {
      tableBodyArray.push(
          <TableRow key={i._id}>
            <TableRowColumn>{i._id}</TableRowColumn>
            <TableRowColumn>{i.name}</TableRowColumn>
            <TableRowColumn>{i.birthday}</TableRowColumn>
            <TableRowColumn>{i.birthdayType}</TableRowColumn>
          </TableRow>
      );
    }
    return (
      <div>
        <Table onRowSelection={this.editRow.bind(this)}>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn>ID</TableHeaderColumn>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Birthday</TableHeaderColumn>
              <TableHeaderColumn>Birthday Type</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableBodyArray}
          </TableBody>
        </Table>
        <br />
        <FlatButton label="add" onTouchTap={this.addRow.bind(this)} primary={true} />
        <FlatButton label="send birthday remainder immediately" onTouchTap={this.sendBirthdayRemainder.bind(this)} primary={true} />
      </div>
    );
  };

  handleBirthdayType(event, index, value) {
    this.setState({_birthdayType: value});
  }

  sendBirthdayRemainder() {
    $.ajax({
      type: 'POST',
      url: '/api/userDirectory/sendBirthdayRemainder'
    }).done(function(data) {
      console.log("send birthday remainder success");
    }).fail(function(jqXhr) {
      console.error("send birthday remainder error");
    });    
  }

  addRow() {
    this.setState({_currentRow: -2});
  }

  editRow(rows) {
    var r = -1;
    if(Array.isArray(rows) && rows.length > 0) {
      r = rows[0];
    }
    else if(rows === "all") {
      r = 0;
    }
    this.setState({_currentRow: r})
  };

  saveRow() {
    var self = this;
    var birthdayDate = self._birthday.getDate()
    var utcDate = new Date(Date.UTC(birthdayDate.getFullYear(),
                                    birthdayDate.getMonth(),
                                    birthdayDate.getDate()));

    if(this.state._currentRow >= 0) {
      var d = self.state._userDirectory[self.state._currentRow];
      $.ajax({
        type: 'PUT',
        url: '/api/userDirectory/id/' + d._id,
        data: {
          name: self._name.input.value,
          birthday: utcDate,
          birthdayType: self.state._birthdayType
        }
      }).done(function(data) {
        console.log("update user directory success");
      }).fail(function(jqXhr) {
        console.error("update user directory error");
      }).always(function() {
        self.setState({_currentRow: -1});
        self.getUserDirectory();
      });
      return;
    }

    if(this.state._currentRow === -2) {
      $.ajax({
        type: 'POST',
        url: '/api/userDirectory',
        data: {
          name: self._name.input.value,
          birthday: utcDate,
          birthdayType: self.state._birthdayType
        }
      }).done(function(data) {
        console.log("add user directory success");
      }).fail(function(jqXhr) {
        console.error("add user directory error");
      }).always(function() {
        self.setState({_currentRow: -1});
        self.getUserDirectory();
      });
      return;
    }
  };

  deleteRow() {
    var self = this;

    if(this.state._currentRow >= 0) {
      var d = self.state._userDirectory[self.state._currentRow];
      $.ajax({
        type: 'DELETE',
        url: '/api/userDirectory/id/' + d._id
      }).done(function(data) {
        console.log("delete user directory success");
      }).fail(function(jqXhr) {
        console.error("delete user directory error");
      }).always(function() {
        self.setState({_currentRow: -1});
        self.getUserDirectory();
      });
      return;
    }

    if(this.state._currentRow === -2) {
      self.setState({_currentRow: -1});
      self.getUserDirectory();
      return;
    }
  };

  getUserDirectory() {
    var self = this;
    $.ajax({
      type: 'GET',
      url: '/api/userDirectory'
    }).done(function(data) {
      self.setState({_userDirectory: data.res});
    }).fail(function(jqXhr) {
      if(jqXhr.status === 403) {
        console.log("login before get user directory");
        window.location.href="/view/login.html";
      }
      else {
        console.error("get user directory error");
      }
    });
  };

};
