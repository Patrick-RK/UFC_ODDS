import { Sequelize, DataTypes, Model } from 'sequelize';

// Initialize Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'data.db',
});

// Define a Fight model with a JSON field for flexible data storage
class Fight extends Model {}
Fight.init(
  {
    data: {
      type: DataTypes.JSON, // Store arbitrary JSON data
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Fight',
  }
);

// Sync the database (create table if it doesn't exist)
sequelize.sync();

export { sequelize, Fight };
