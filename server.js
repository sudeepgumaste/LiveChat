const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const socketio = require('socket.io');
const { formatMessage } = require('./express/utils/messages');
const { userJoin, getCurrentUser, userLeave } = require('./express/utils/users');
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// setting static port
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'LiveChat Bot';

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    // single client -> socket.emit
    socket.emit('message', formatMessage(botName, 'Welcome to LiveChat!'));
    // broadcast when use connects
    // broadcast to everone except the new connection
    socket.broadcast.to(user.room).emit(
      'message',
      formatMessage(botName, `${username} joined the chat`)
    );
    // for all the clients // io.emit()
  });

  // listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);
    socket.broadcast.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client leaves
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    if(user){
      io.to(user.room).emit('message', formatMessage(botName, `${user.username} left the chat`));
    }
  });

});

// Run

const { PORT = 3000 } = process.env;

server.listen(PORT, () =>
  console.log(`server listening on http://localhost:${PORT}`)
);
