// 引入sub.js
var sub = require('./sub');

// 引入样式
var main = require('./main.css');
var main1 = require('./main1.scss');

var app = document.createElement('div');
app.innerHTML = '<h1>webpack demo h1</h1>';
app.appendChild(sub());
document.body.appendChild(app);
