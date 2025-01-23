import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/dbConfig'; // Assuming the database connection is set up here

// Define the attributes for the Event model
interface EventAttributes {
  eventId: number;
  eventName: string;
  eventUrl: string;
  eventDate: string;
  eventLocation: string;
}

// Optional attributes are the ones that are not required during creation (like `eventId` in case it's auto-generated)
interface EventCreationAttributes extends Optional<EventAttributes, 'eventId'> {}

class Event extends Model<EventAttributes, EventCreationAttributes> implements EventAttributes {
  public eventId!: number; // Declare non-nullable attributes
  public eventName!: string;
  public eventUrl!: string;
  public eventDate!: string;
  public eventLocation!: string;

  // Timestamps will be automatically handled by Sequelize
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the Event model
Event.init(
  {
    eventId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    eventName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    eventUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    eventDate: {
      type: DataTypes.STRING, // Change to DataTypes.DATE if you want to use Date objects
      allowNull: false,
    },
    eventLocation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Event',
    tableName: 'events',
  }
);

export default Event;
