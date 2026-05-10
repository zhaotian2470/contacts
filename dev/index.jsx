import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import IndexMenu from './IndexMenu';
import UserDirectory from './UserDirectory';
import Profile from './Profile';
import Logout from './Logout';

const theme = createTheme();

class App extends React.Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Router basename="/view">
          <div>
            <IndexMenu />
            <hr />
            <Routes>
              <Route path="/index/*" element={<UserDirectory />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/logout" element={<Logout />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    );
  }
}

const root = ReactDOM.createRoot(document.querySelector("#container"));
root.render(<App />);
