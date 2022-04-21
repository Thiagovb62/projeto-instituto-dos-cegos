require('dotenv').config();
require('./app/config/moduleAliasConfig');
const passport = require('passport');
require('./database');

require('events').EventEmitter.prototype._maxListeners = 100;
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  routes() {
    this.server.use(routes);
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(passport.initialize());
    this.server.use(cors());
  }
}

module.exports = new App().server;
