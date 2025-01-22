import { Sequelize, DataTypes, Model } from 'sequelize';

// Initialize Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'data.db',
});

// Define the Fighter model
class Fighter extends Model {}
Fighter.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Fighter',
  }
);

// Define the Fight model
class Fight extends Model {}
Fight.init(
  {
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Events', // Referencing the Event table
        key: 'id',
      },
    },
    red_fighter_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Fighters', // Referencing the Fighter table for the red fighter
        key: 'id',
      },
    },
    blue_fighter_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Fighters', // Referencing the Fighter table for the blue fighter
        key: 'id',
      },
    },
    weight_class: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    title: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    interim_title: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Fight',
  }
);

// Define the FightResults model
class FightResults extends Model {}
FightResults.init(
  {
    fight_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Fights', // Referencing the Fight table
        key: 'id',
      },
    },
    fighter_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Fighters', // Referencing the Fighter table
        key: 'id',
      },
    },
    performance_bonus: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    fight_bonus: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    outcome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    method: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    round: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'FightResults',
  }
);

// Define relationships
Fight.belongsTo(Fighter, { as: 'RedFighter', foreignKey: 'red_fighter_id' });
Fight.belongsTo(Fighter, { as: 'BlueFighter', foreignKey: 'blue_fighter_id' });
FightResults.belongsTo(Fight, { foreignKey: 'fight_id' });
FightResults.belongsTo(Fighter, { foreignKey: 'fighter_id' });

// Sync the database (create tables if they don't exist)
sequelize.sync();

export { sequelize, Fight, Fighter, FightResults };
