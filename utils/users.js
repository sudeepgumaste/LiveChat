const users = [];

// join user to chat
const userJoin = (id, username, room) => {
  const user = {id, username, room};
  users.push(user);

  return user;
}

const getCurrentUser = (id) => {
  return users.find(user=> user.id === id);
}

const userLeave = (id) => {
  index = users.findIndex((user)=>user.id===id);

  if(index !== -1){
    return users.splice(index,1)[0];
  }
}

module.exports = { 
  userJoin, 
  getCurrentUser,
  userLeave
}