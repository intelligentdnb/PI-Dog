const { DataTypes } = require('sequelize');

//Exporto la funcion temperamento
module.exports = sequelize => {
    //defino temperament
    sequelize.define('temperament', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });
};