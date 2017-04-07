import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Logout from './Logout';
import Profile from './Profile';
import UserDirectory from './UserDirectory';

injectTapEventPlugin();

const App = () => (
    <MuiThemeProvider>
    <Router>
    <div>
    <ul>
    <li><Link to="/">User Directory</Link></li>
    <li><Link to="/profile">Profile</Link></li>
    <li><Link to="/logout">Logout</Link></li>
    </ul>

    <hr/>

    <Route exact path="/" component={UserDirectory}/>
    <Route path="/profile" component={Profile}/>
    <Route path="/logout" component={Logout}/>
    </div>
    </Router>
    </MuiThemeProvider>
)

ReactDOM.render(<App/>, document.querySelector("#container"));
