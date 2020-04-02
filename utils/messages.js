const moment = require('moment');

const formatMessage = (username, text) => ({
  username,
  text,
  time: moment().format('h:mm a')
});

module.exports = {
  formatMessage
};
