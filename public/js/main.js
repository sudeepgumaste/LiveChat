const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const socket = io();

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

// join room message
socket.emit('joinRoom', { username, room });

// Output message to DOM
const outputMessage = (message, author) => {
  const div = document.createElement('div');
  div.classList.add('message');
  div.classList.add(author);
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`;
  document.querySelector('.chat-messages').appendChild(div);
};

// Message from server
socket.on('message', message => {
  // console.log(message);
  outputMessage(message, 'other');
  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();
  const msg = e.target.msg.value;
  // console.log(msg)
  // emiting an event with message to server
  socket.emit('chatMessage', msg);
  outputMessage(
    { username, text: msg, time: moment().format('h:mm a') },
    'self'
  );
  chatMessages.scrollTop = chatMessages.scrollHeight;
  e.target.msg.value = '';
  e.target.msg.focus();
});
