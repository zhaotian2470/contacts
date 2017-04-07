import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IndexMenu from './IndexMenu';
import UserDirectory from './UserDirectory';
import Profile from './Profile';
import Logout from './Logout';

injectTapEventPlugin();

class App extends React.Component {
  render() {
    return (
        <MuiThemeProvider>
        <Router basename="/view">
        <div>

          <IndexMenu />
          <hr />

          <Route path="/index*" component={UserDirectory}/>
          <Route path="/profile" component={Profile}/>
          <Route path="/logout" component={Logout}/>

        </div>
        </Router>
        </MuiThemeProvider>
    )
  }
}

ReactDOM.render(<App/>, document.querySelector("#container"));
