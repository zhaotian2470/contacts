import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import $ from "jquery";

class ShowDirectory extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      _userDirectory: []
    };
  };

  componentDidMount() {
    this.getUserDirectory();
  };

  render() {
    var tableBodyArray = [];
    var headStyle = {
      backgroundColor: "#CD5C5C"
    };
    var bodyStyle = {
      backgroundColor: "#008000"
    };

    for(var i of this.state._userDirectory) {
      tableBodyArray.push(
          <TableRow key={i._id} style={bodyStyle}>
            <TableRowColumn>{i.name}</TableRowColumn>
            <TableRowColumn>{new Date(i.birthday).toISOString().split('T')[0]}</TableRowColumn>
            <TableRowColumn>{i.birthdayType}</TableRowColumn>
          </TableRow>
      );
    }
    return (
      <div>
        <Table onRowSelection={this.selectRow.bind(this)}>
          <TableHeader>
            <TableRow style={headStyle}>
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
        console.error("get user directory error: " + jqXhr.responseJSON.message);
      }
    });
  };

  selectRow(rows) {
    var r = -1;
    if(Array.isArray(rows) && rows.length > 0) {
      r = rows[0];
    }
    else if(rows === "all") {
      r = 0;
    }

    if( r >= 0 ) {
      this.props.editRow(this.state._userDirectory[r]);
    }
  };

  addRow() {
    this.props.addRow();
  }

  sendBirthdayRemainder() {
    $.ajax({
      type: 'POST',
      url: '/api/userDirectory/sendBirthdayRemainder'
    }).done(function(data) {
      console.log("send birthday remainder success");
    }).fail(function(jqXhr) {
      console.error("send birthday remainder error: " + jqXhr.responseJSON.message);
    });
  }
};

class EditDirectory extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      errorText: '',
      _birthdayType: '阳历'
    };
  };

  componentWillMount() {
    if(this.props.data && this.props.data.birthdayType) {
      this.setState({_birthdayType: this.props.data.birthdayType});
    }
  };

  render() {
    return (
      <form>
        <TextField type="text" name="name" defaultValue={ this.props.data ? this.props.data.name : ""}
          errorText = {this.state.errorText}
          ref={
            (e) => {
              this._name = e
            }
          }
        />
        <br />
        <DatePicker name="birthday" hintText="生日" defaultDate={this.props.data ? new Date(this.props.data.birthday) : new Date()}
          errorText = {this.state.errorText}
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
  };

  handleBirthdayType(event, index, value) {
    this.setState({_birthdayType: value});
  }

  saveRow() {
    var self = this;
    var birthdayDate = self._birthday.getDate()
    var utcDate = new Date(Date.UTC(birthdayDate.getFullYear(),
                                    birthdayDate.getMonth(),
                                    birthdayDate.getDate()));

    if(this.props.data) {
      $.ajax({
        type: 'PUT',
        url: '/api/userDirectory/id/' + this.props.data._id,
        data: {
          name: self._name.input.value,
          birthday: utcDate,
          birthdayType: self.state._birthdayType
        }
      }).done(function(data) {
        console.log("update user directory success");
        self.props.afterSave();
      }).fail(function(jqXhr) {
        console.error("update user directory error: " + jqXhr.responseJSON.message);
        self.setState({errorText: jqXhr.responseJSON.message});
      });
      return;
    }

    if(!this.props.data) {
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
        self.props.afterSave();
      }).fail(function(jqXhr) {
        console.error("add user directory error: " + jqXhr.responseJSON.message);
        self.setState({errorText: jqXhr.responseJSON.message});
      });
      return;
    }


  };

  deleteRow() {
    var self = this;

    if(this.props.data) {
      $.ajax({
        type: 'DELETE',
        url: '/api/userDirectory/id/' + this.props.data._id
      }).done(function(data) {
        console.log("delete user directory success");
        self.props.afterDelete();
      }).fail(function(jqXhr) {
        console.error("delete user directory error: " + jqXhr.responseJSON.message);
        self.setState({errorText: jqXhr.responseJSON.message});
      });
      return;
    }

    if(!this.props.data) {
      self.props.afterDelete();
      return;
    }
  };

};

export default class UserDirectory extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      _action: "show",
      _item: null
    };
  };

  render() {

    if(this.state._action === "show") {
      return (
          <ShowDirectory editRow={this.editRow.bind(this)} addRow={this.addRow.bind(this)} />
      );
    }

    if(this.state._action === "edit") {
      return (
          <EditDirectory afterSave={this.afterSave.bind(this)} afterDelete={this.afterDelete.bind(this)} data={this.state._item} />
      );
    }
  };

  editRow(item) {
    this.setState({_action: "edit", _item: item});
  }

  addRow() {
    this.setState({_action: "edit", _item: null});
  }

  afterSave() {
    this.setState({_action: "show", _item: null});
  }

  afterDelete() {
    this.setState({_action: "show", _item: null});
  }

};
