import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default class IndexMenu extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      anchorElDirectory: null,
      anchorElUser: null,
    };
  }

  handleClickDirectory = (event) => {
    this.setState({ anchorElDirectory: event.currentTarget });
  };

  handleCloseDirectory = () => {
    this.setState({ anchorElDirectory: null });
  };

  handleClickUser = (event) => {
    this.setState({ anchorElUser: event.currentTarget });
  };

  handleCloseUser = () => {
    this.setState({ anchorElUser: null });
  };

  render() {
    const style = { margin: 2 };

    return (
      <div>
        <Button
          onClick={this.handleClickDirectory}
          variant="contained"
          color="primary"
          style={style}
        >
          Directory
        </Button>
        <Popover
          open={Boolean(this.state.anchorElDirectory)}
          anchorEl={this.state.anchorElDirectory}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
          onClose={this.handleCloseDirectory}
        >
          <Menu
            open={Boolean(this.state.anchorElDirectory)}
            anchorEl={this.state.anchorElDirectory}
            onClose={this.handleCloseDirectory}
          >
            <MenuItem component={Link} to="/index" onClick={this.handleCloseDirectory}>
              Show
            </MenuItem>
          </Menu>
        </Popover>

        <Button
          onClick={this.handleClickUser}
          variant="contained"
          color="primary"
          style={style}
        >
          User
        </Button>
        <Menu
          open={Boolean(this.state.anchorElUser)}
          anchorEl={this.state.anchorElUser}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
          onClose={this.handleCloseUser}
        >
          <MenuItem component={Link} to="/profile" onClick={this.handleCloseUser}>
            Profile
          </MenuItem>
          <MenuItem component={Link} to="/logout" onClick={this.handleCloseUser}>
            Logout
          </MenuItem>
        </Menu>
      </div>
    );
  }
}
