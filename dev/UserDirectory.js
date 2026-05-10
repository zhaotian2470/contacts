import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import $ from "jquery";

class ShowDirectory extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      _userDirectory: []
    };
  }

  componentDidMount() {
    this.getUserDirectory();
  }

  render() {
    var headStyle = { backgroundColor: "#CD5C5C" };
    var bodyStyle = { backgroundColor: "#008000" };

    return (
      <div>
        <Table>
          <TableHead>
            <TableRow style={headStyle}>
              <TableCell>Name</TableCell>
              <TableCell>Birthday</TableCell>
              <TableCell>Birthday Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state._userDirectory.map((i) => (
              <TableRow key={i._id} style={bodyStyle} hover onClick={() => this.props.editRow(i)}>
                <TableCell>{i.name}</TableCell>
                <TableCell>{new Date(i.birthday).toISOString().split('T')[0]}</TableCell>
                <TableCell>{i.birthdayType}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <br />
        <Button onClick={this.props.addRow} color="primary">add</Button>
        <Button onClick={this.sendBirthdayRemainder.bind(this)} color="primary">
          send birthday remainder immediately
        </Button>
      </div>
    );
  }

  getUserDirectory() {
    var self = this;
    $.ajax({
      type: 'GET',
      url: '/api/userDirectory'
    }).done(function(data) {
      self.setState({ _userDirectory: data.res });
    }).fail(function(jqXhr) {
      if (jqXhr.status === 403) {
        window.location.href = "/view/login.html";
      } else {
        console.error("get user directory error: " + jqXhr.responseJSON.message);
      }
    });
  }

  sendBirthdayRemainder() {
    $.ajax({
      type: 'POST',
      url: '/api/userDirectory/sendBirthdayRemainder'
    }).done(function() {
      console.log("send birthday remainder success");
    }).fail(function(jqXhr) {
      console.error("send birthday remainder error: " + jqXhr.responseJSON.message);
    });
  }
}

class EditDirectory extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      errorText: '',
      _birthdayType: props.data && props.data.birthdayType ? props.data.birthdayType : '阳历',
      _birthday: props.data ? dayjs(props.data.birthday) : dayjs(),
    };
  }

  render() {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <form>
          <TextField
            type="text"
            name="name"
            label="Name"
            defaultValue={this.props.data ? this.props.data.name : ""}
            error={Boolean(this.state.errorText)}
            helperText={this.state.errorText}
            inputRef={(el) => { this._nameInput = el; }}
          />
          <br />
          <DatePicker
            label="生日"
            value={this.state._birthday}
            onChange={(newValue) => this.setState({ _birthday: newValue })}
            slotProps={{ textField: { error: Boolean(this.state.errorText) } }}
          />
          <br />
          <FormControl>
            <InputLabel>Birthday Type</InputLabel>
            <Select
              name="birthdayType"
              value={this.state._birthdayType}
              label="Birthday Type"
              onChange={this.handleBirthdayType.bind(this)}
            >
              <MenuItem value={"阳历"}>阳历</MenuItem>
              <MenuItem value={"阴历"}>阴历</MenuItem>
            </Select>
          </FormControl>
          <br />
          <Button onClick={this.saveRow.bind(this)} color="primary">save</Button>
          <Button onClick={this.deleteRow.bind(this)} color="primary">delete</Button>
        </form>
      </LocalizationProvider>
    );
  }

  handleBirthdayType(event) {
    this.setState({ _birthdayType: event.target.value });
  }

  saveRow() {
    var self = this;
    var birthdayDate = self.state._birthday.toDate();
    var utcDate = new Date(Date.UTC(
      birthdayDate.getFullYear(),
      birthdayDate.getMonth(),
      birthdayDate.getDate()
    ));

    if (this.props.data) {
      $.ajax({
        type: 'PUT',
        url: '/api/userDirectory/id/' + this.props.data._id,
        data: {
          name: self._nameInput.value,
          birthday: utcDate,
          birthdayType: self.state._birthdayType
        }
      }).done(function() {
        self.props.afterSave();
      }).fail(function(jqXhr) {
        console.error("update user directory error: " + jqXhr.responseJSON.message);
        self.setState({ errorText: jqXhr.responseJSON.message });
      });
      return;
    }

    $.ajax({
      type: 'POST',
      url: '/api/userDirectory',
      data: {
        name: self._nameInput.value,
        birthday: utcDate,
        birthdayType: self.state._birthdayType
      }
    }).done(function() {
      self.props.afterSave();
    }).fail(function(jqXhr) {
      console.error("add user directory error: " + jqXhr.responseJSON.message);
      self.setState({ errorText: jqXhr.responseJSON.message });
    });
  }

  deleteRow() {
    var self = this;

    if (this.props.data) {
      $.ajax({
        type: 'DELETE',
        url: '/api/userDirectory/id/' + this.props.data._id
      }).done(function() {
        self.props.afterDelete();
      }).fail(function(jqXhr) {
        console.error("delete user directory error: " + jqXhr.responseJSON.message);
        self.setState({ errorText: jqXhr.responseJSON.message });
      });
      return;
    }

    self.props.afterDelete();
  }
}

export default class UserDirectory extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      _action: "show",
      _item: null
    };
  }

  render() {
    if (this.state._action === "show") {
      return (
        <ShowDirectory editRow={this.editRow.bind(this)} addRow={this.addRow.bind(this)} />
      );
    }

    if (this.state._action === "edit") {
      return (
        <EditDirectory
          afterSave={this.afterSave.bind(this)}
          afterDelete={this.afterDelete.bind(this)}
          data={this.state._item}
        />
      );
    }
  }

  editRow(item) {
    this.setState({ _action: "edit", _item: item });
  }

  addRow() {
    this.setState({ _action: "edit", _item: null });
  }

  afterSave() {
    this.setState({ _action: "show", _item: null });
  }

  afterDelete() {
    this.setState({ _action: "show", _item: null });
  }
}
