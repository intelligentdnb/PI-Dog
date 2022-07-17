const { DataTypes } = require('sequelize');

//Exporto la funcion temperamento
module.exports = sequelize => {
    //defino temperament
    sequelize.define('temperament', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true, 
          },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdInDb: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
          }
    });
};