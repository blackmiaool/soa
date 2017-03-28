import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);

import $ from 'jquery';
console.log(window);
window.jQuery = $;
window.$ = $;
global.jQuery = $;
var bootstrap = require('bootstrap');
console.log(bootstrap);
