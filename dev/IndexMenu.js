import React from 'react';
import {
  Link
} from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

export default class IndexMenu extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      openDirectory: false,
      openUser: false,
    };
  }

  handleTouchTapDirectory = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      openDirectory: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestCloseDirectory = () => {
    this.setState({
      openDirectory: false,
    });
  };

  handleTouchTapUser = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      openUser: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestCloseUser = () => {
    this.setState({
      openUser: false,
    });
  };

  render() {
    const style = {
      margin: 2,
    };

    return (
      <div>
        <RaisedButton
          onTouchTap={this.handleTouchTapDirectory}
          primary={true} style={style}
          label="Directory"
        />
        <Popover
          open={this.state.openDirectory}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestCloseDirectory}
        >
          <Menu>
            <MenuItem primaryText="Show" containerElement={<Link to="/index" />} />
          </Menu>
        </Popover>
        <RaisedButton
          onTouchTap={this.handleTouchTapUser}
          primary={true} style={style}
          label="User"
        />
        <Popover
          open={this.state.openUser}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestCloseUser}
        >
          <Menu>
            <MenuItem primaryText="Profile" containerElement={<Link to="/profile" />} />
            <MenuItem primaryText="Logout" containerElement={<Link to="/logout" />} />
          </Menu>
        </Popover>
      </div>
    );
  }
}
