var express = require('express');
var app = express();
var port = 3003;
app.use(express.static(__dirname + '/www'));
// app.get('/', function(req, res, next) {
//     res.send('<ul><li><a href="www">www</a></li></ul>');
// });
app.listen(port);
console.log('listening at ' + port);
