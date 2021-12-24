const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

app.use(express.static('public'));


/* Rainbow cube */
app.get('/rainbow_cube.obj', function (req, res) {
  res.sendFile(__dirname + '/bin/objs/rainbow_cube/cube.obj');
})

app.get('/rainbow_cube.png', function (req, res) {
  res.sendFile(__dirname + '/bin/objs/rainbow_cube/cube.png');
})

/* Simple cube */
app.get('/cube.obj', function (req, res) {
  res.sendFile(__dirname + '/bin/objs/cube/cube.obj');
})

app.get('/cube.png', function (req, res) {
  res.sendFile(__dirname + '/bin/objs/cube/cube.png');
})


server.listen(3000, () => {
  console.log('listening on: 3000');
});