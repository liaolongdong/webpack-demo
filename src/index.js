// // 引入jquery和moment
// var $ = require('jquery');
// var moment = require('moment');

// // 引入sub.js
// var sub = require('./sub');

// // 引入样式
// var main = require('./main.css');

// var app = document.createElement('div');
// app.innerHTML = '<h1>webpack demo h1</h1>';
// app.appendChild(sub());
// document.body.appendChild(app);

// $('body').append('<h3>now time is: ' + moment().format('YYYY-MM-DD hh:mm:ss') + '</h3>');


// es6
import './main.css';
import sub from './sub';
import $ from 'jquery';
import moment from 'moment';

let app  = document.createElement('div');
const myPromise = Promise.resolve(66);
myPromise.then((number) => {
  $('body').append('<h3>promise result is ' + number + ' now is ' + moment().format('YYYY-MM-DD hh:mm:ss') + '</h3>');
});
app.innerHTML = '<h1>webpack demo h1</h1>';
document.body.appendChild(app);
app.appendChild(sub());
