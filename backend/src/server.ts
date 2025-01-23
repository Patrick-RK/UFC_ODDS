import express from 'express';
import cors from 'cors';  // Import cors package
import { scrapeMatchData } from './scrape'; // Import the scraping function
import bodyParser from 'body-parser';
import Event from './models/events'; // Adjust the path
import { sequelize } from './config/dbConfig'; // Adjust the path

const app = express();
const port = 4000;

// Enable CORS for all routes
app.use(bodyParser.json());

app.use(cors()); // Allow requests from any origin (you can specify domains if needed)

sequelize.sync({ alter: true }) // `{ alter: true }` updates the schema if necessary
  .then(() => console.log('Database synchronized and tables created!'))
  .catch((err) => console.error('Error synchronizing database:', err));


// GET route to check the page loading
app.get('/api/fights', async (req, res) => {
  try {
    // Define the URL you want to scrape
    const url = 'http://www.ufcstats.com/statistics/events/completed'; // Replace with the actual URL

    // Call the scraping function
    const fightData = await scrapeMatchData(url);

    // Send the scraped data back to the client
    res.json(fightData);
  } catch (error) {
    console.error('Error in /api/fights route:', error);
    res.status(500).send('Failed to fetch fight data');
  }
});

// POST route for button press simulation
app.post('/button-pressed', (req, res) => {
    console.log('Received state:', req.body.highlighted); // Log the received state
    res.json({ message: 'State received and logged successfully!' });
  });

// Start the server once
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
