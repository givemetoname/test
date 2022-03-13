var http = require('http');

const config = require('./config/config')

 http.createServer(config.createServer,config.sotinh).listen(config.port,console.log('connected locallhost:', config.port))