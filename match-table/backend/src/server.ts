import express from 'express';
import cors from 'cors';  // Import cors package
import { scrapeMatchData } from './scrape'; // Import the scraping function
import bodyParser from 'body-parser';

const app = express();
const port = 4000;

// Enable CORS for all routes
app.use(bodyParser.json());

app.use(cors()); // Allow requests from any origin (you can specify domains if needed)

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
