import { Sequelize, DataTypes, Model } from 'sequelize';
import { fighterSchema, fightSchema, fightResultsSchema } from '../../../shared/zodSchemas'; // Adjust the path accordingly

// Initialize Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'data.db',
});

// Define Sequelize models
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

class Fight extends Model {}
Fight.init(
  {
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Events',
        key: 'id',
      },
    },
    red_fighter_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Fighters',
        key: 'id',
      },
    },
    blue_fighter_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Fighters',
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

class FightResults extends Model {}
FightResults.init(
  {
    fight_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Fights',
        key: 'id',
      },
    },
    fighter_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Fighters',
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

// Validation function for Fighter
async function validateFighter(fighterData: any) {
  try {
    // Use the existing Zod schema for validation
    const parsed = fighterSchema.parse(fighterData); // Validate using predefined schema
    const fighter = await Fighter.create(parsed);
    return fighter;
  } catch (err) {
    throw new Error(`Validation failed for Fighter: ${err}`);
  }
}

// Validation function for Fight
async function validateFight(fightData: any) {
  try {
    // Use the existing Zod schema for validation
    const parsed = fightSchema.parse(fightData); // Validate using predefined schema
    const fight = await Fight.create(parsed);
    return fight;
  } catch (err) {
    throw new Error(`Validation failed for Fight: ${err}`);
  }
}

// Validation function for FightResults
async function validateFightResults(fightResultsData: any) {
  try {
    // Use the existing Zod schema for validation
    const parsed = fightResultsSchema.parse(fightResultsData); // Validate using predefined schema
    const fightResults = await FightResults.create(parsed);
    return fightResults;
  } catch (err) {
    throw new Error(`Validation failed for FightResults: ${err}`);
  }
}

// Export models and validation functions
export { sequelize, Fighter, Fight, FightResults, validateFighter, validateFight, validateFightResults };
