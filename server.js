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
   console.log('new connection in chat-demo, server.js, ' + socket.id);
   
   var logoffTimer;
   
   socket.on('chat message', msg => {
      // set a timer that will log off an idle (not chatty) user
      clearTimeout( logoffTimer);
      logoffTimer = setTimeout(function(){
         socket.emit('chat message', 'idle socket disconnected, ' + socket.id);
         console.log('idle socket disconnected, ' + socket.id);
         socket.disconnect();
      }, 1 * 30 * 1000);
      
      io.emit('chat message', msg);
   });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
