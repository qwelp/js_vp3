var express = require('express');
var app = express();
var server = require('http').createServer(app);
var path = require('path');

server.listen(3000);

var publicPath = path.join(__dirname, '/');
app.use(express.static(publicPath));

app.get('/', (request, response) => {
    response.sendFile(__dirname + "/index.html");
});