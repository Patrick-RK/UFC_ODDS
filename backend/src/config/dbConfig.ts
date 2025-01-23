import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // Path to your SQLite database file
});

sequelize.authenticate()
  .then(() => console.log('Database connected!'))
  .catch((err) => console.error('Error connecting to the database:', err));

export default sequelize;
