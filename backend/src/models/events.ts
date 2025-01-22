import { Sequelize, DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/dbConfig';  // Import database connection

class Event extends Model {}

Event.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,  // Or DataTypes.DATE if using a date object
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Event',
  }
);

export default Event;
