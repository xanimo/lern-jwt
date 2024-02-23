require('dotenv').config();

const config = () => {
  return process.env.REACT_APP_PORT
};

module.exports = config;
