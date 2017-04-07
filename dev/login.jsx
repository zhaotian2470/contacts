import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Login from './Login';

injectTapEventPlugin();

const App = () => (
    <MuiThemeProvider>
      <Login />
    </MuiThemeProvider>
);

ReactDOM.render(<App />, document.querySelector("#container"));
