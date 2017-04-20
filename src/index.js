// 引入sub.js
var sub = require('./sub');

var app = document.createElement('div');
app.innerHTML = '<h1>webpack demo h1</h1>';
app.appendChild(sub());
document.body.appendChild(app);
