import Sequelize, { Model } from 'sequelize'
class Appointment extends Model{
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE
      },
      {
        sequelize
      }
    );
    return this;
  }

  static associate(models){
    //foreignKey: 'como a coluna vai ser chamar na tabela appointments'
    this.belongsTo(models.User, {foreignKey: 'user_id', as: 'user'});
    this.belongsTo(models.User, {foreignKey: 'provider_id', as: 'provider'});
  }
}
export default Appointment;
