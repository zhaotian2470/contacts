import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Login from './Login';

const theme = createTheme();

const App = () => (
  <ThemeProvider theme={theme}>
    <Login />
  </ThemeProvider>
);

const root = ReactDOM.createRoot(document.querySelector("#container"));
root.render(<App />);
