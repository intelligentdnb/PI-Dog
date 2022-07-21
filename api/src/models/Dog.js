const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('dog', {
    id:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image:{
    type: DataTypes.STRING,
    allowNull: true
  },
  life_span_min: {
    type: DataTypes.STRING,
    allowNull: true
  },
  life_span_max: {
    type: DataTypes.STRING,
    allowNull: true
  },
  height_min: {
    type: DataTypes.STRING,
    allowNull: false,
  },
   height_max: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  weight_min: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  weight_max: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdInDB: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  },
  {
    timestamps:false
  });
};

/* 

id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image:{
      type: DataTypes.STRING,
      allowNull: true
    },
    life_span_max: {
      type: DataTypes.STRING,
      allowNull: true

    },
    life_span_min: {
      type: DataTypes.STRING,
      allowNull: true

    },
     height_max: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    height_min: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weight_max: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weight_min: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdInDB: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }


*/


/*  El mio 

id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    height: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weight: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    life_span: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "10 años",
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "image.url",
    },
    createdInDb: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    }, 


*/