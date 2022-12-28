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
      // set (reset) a timer that will log off an idle (not chatty) user
      clearTimeout( logoffTimer);
      logoffTimer = setTimeout(function(){
         let disconnectNotice = 'idle socket disconnected (id=' + socket.id + ')';
         socket.emit('chat message', disconnectNotice);
         console.log( disconnectNotice);
         socket.disconnect();
      }, 1 * 15 * 1000); // 5ky 60n 30n 10y 15y 25n 20n
      
      io.emit('chat message', msg);
   });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
