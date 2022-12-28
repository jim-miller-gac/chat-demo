const app = require('express')();
const http = require('http').Server(app);

let options = { cors: {origin: "*"} };
const io = require('socket.io')(http, options);

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
   res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
   console.log('new connection in chat-demo, server.js, ' + socket.id);
   
   // timer to log off an idle client
   var logoffTimer;
   function setTimer() {
      logoffTimer = setTimeout( () => {
         let disconnectNotice = 'Idle for 15min; socket disconnected.';
         let idString = ' (id=' + socket.id + ')';
         socket.emit('chat message', disconnectNotice);
         console.log( disconnectNotice + idString);
         socket.disconnect();
      }, 15 * 60 * 1000);
   }
   
   setTimer();
   
   socket.on('chat message', msg => {
      
      clearTimeout( logoffTimer);
      setTimer();
      
      io.emit('chat message', msg);
   });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
