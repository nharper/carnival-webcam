var ReactDOM = require('react-dom');
var React = require('react');

var MainPage = require('./MainPage');

window.onload = function() {
  ReactDOM.render(
    <MainPage />,
    document.getElementById('content')
  );
}
