import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LoginForm from './LoginForm';

injectTapEventPlugin();

const App = () => (
    <MuiThemeProvider>
      <LoginForm />
    </MuiThemeProvider>
);

ReactDOM.render(<App />, document.querySelector("#container"));
