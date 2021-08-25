import React from 'react';
import ReactDOM from 'react-dom';
import 'css/index.css';
import App from './App';
import Main from './Main'

ReactDOM.render(
  <React.StrictMode>
    <Main/>
    {/* <App /> */}
  </React.StrictMode>,
  document.getElementById('root')
);