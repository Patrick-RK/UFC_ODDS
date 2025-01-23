import express from 'express';
import sqlite3 from 'sqlite3';
import path from 'path';
import cors from 'cors';  // Import cors package


// Create the Express app
const app = express();
const port = 3000;
app.use(cors());
// Set up SQLite database connection
const db = new sqlite3.Database(path.resolve(__dirname, 'database.sqlite'));

// Middleware to parse JSON
app.use(express.json());

// API endpoint to fetch events from the database
app.get('/api/events', (req, res) => {
  // Query the database to get all events
  const query = 'SELECT * FROM events'; // Adjust the query as needed based on your table structure
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching events:', err);
      res.status(500).json({ error: 'Failed to fetch events' });
      return;
    }
    // Send the fetched data as a JSON response
    res.json(rows);
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
