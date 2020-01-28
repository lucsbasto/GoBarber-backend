module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users', // a tabela que eu vou criar a coluna
      'avatar_id', // o nome da coluna
      {
        type: Sequelize.INTEGER,
        references: { model: 'files', key: 'id' },
        onUpdate: 'CASCADE', // se o arquivo for alterado na tabela file ele também vai ser alterado na coluna avatar_id
        onDelete: 'SET NULL', // se o arquivo for deletado na tabela file ele será setado como null na coluna avatar_id
        allowNull: true,
      }
    );
  },

  down: queryInterface => {
    return queryInterface.removeColunm('users', 'avatar_id');
  },
};
