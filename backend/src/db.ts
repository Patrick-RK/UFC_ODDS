import express from 'express';
import { sequelize } from './config/dbConfig';  // Import database connection
import { createEvent } from './controllers/eventController';  // Import event controller

const app = express();
app.use(express.json());

// Route to create event
app.post('/events', async (req, res) => {
    try {
        // Your code that might throw an error
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error message:', error.message);
        } else {
          console.error('An unknown error occurred');
        }
      }
});

// Sync database tables
sequelize.sync().then(() => {
  console.log('Database synced!');
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
