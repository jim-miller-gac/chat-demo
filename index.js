const app = require('express')();
const http = require('http').Server(app);
//const io = require('socket.io')(http);

let options = { cors: {origin: "*"} };
const io = require('socket.io')(http, options);

const port = process.env.PORT || 3000;

/*
*/
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

/*
app.get('/', function(req, res) {
   // In a browser, if you set the URL to localhost:3000, you'll get this page:
   res.sendFile( 'index.html', {'root': '.'} );
});
*/

io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
