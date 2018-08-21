const path = require('path'),
      url = require('url'),
      fs = require('fs'),
      port = process.argv[2]; 
require('dotenv').config();

const config = () => {
    console.log(path.join(process.cwd(), '..'))
    console.log(url)
    console.log(fs)
    console.log(port)

    var filename = path.join(process.cwd(), '.');
  
  return process.env.REACT_APP_PORT
};

module.exports = config;