'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'category_id', {
      type: Sequelize.INTEGER,
      onUpdate: 'CASCADE',      //Caso haja mudança na tabela categorias, ela ocorra nessa também
      onDelete: 'SET NULL',       //Caso delete o registro na tabela categorias, torna nulo o campo nesta tabela
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('products', 'category_id');
  }
};
