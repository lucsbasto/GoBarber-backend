import Sequelize from 'sequelize';

import databaseConfig from '../config/database';
import User from '../app/models/User';
import File from '../app/models/File';
const models = [User, File];

class Database {
  constructor() {
    this.init();
  }

  init() {
    // variavel sequelize recebida dentro dos models
    this.connection = new Sequelize(databaseConfig);
    models
    .map(model => {
      return model.init(this.connection)
  })
    .map(model =>{
      return model.associate && model.associate(this.connection.models)
    });
  }
}

export default new Database();
