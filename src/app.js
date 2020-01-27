import express from 'express';
import './database';
import { resolve } from 'path';
const routes = require('./routes');

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use('/files', express.static(resolve(__dirname, '..', 'temp', 'uploads')));
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
