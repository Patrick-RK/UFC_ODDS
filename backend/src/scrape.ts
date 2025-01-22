import axios from 'axios';
import { JSDOM } from 'jsdom';
import { eventSchema, fightSchema } from '../../shared/zodSchemas'; // Import the Zod schemas for validation

// Function to scrape match data from a given URL
export async function scrapeMatchData(url: string) {
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    const tbody = document.querySelector('tbody');
    if (!tbody) throw new Error('No <tbody> found');

    const rows = tbody.querySelectorAll('tr');
    const targetRow = rows[1]; // Change this as needed to target the correct row

    if (!targetRow) throw new Error('Target row not found');

    // Get event data (event name, location, date, and event URL)
    const eventDetails = getEventDetails(targetRow);
    const validatedEventDetails = eventSchema.parse(eventDetails); // Validate event data using Zod schema

    // Scrape data from the next page (if necessary)
    const nextPageUrl = getNextPageUrl(targetRow);
    const nextPageResponse = await axios.get(nextPageUrl);
    const nextDom = new JSDOM(nextPageResponse.data);
    const nextDocument = nextDom.window.document;
    const nextTbody = nextDocument.querySelector('tbody');
    if (!nextTbody) throw new Error('No <tbody> found on the next page');

    const nextRows = nextTbody.querySelectorAll('tr');
    
    // Use the separate getFightDetails function to get fight details for each row
    const fights = Array.from(nextRows).map((row: HTMLTableRowElement) => {
      const fightDetails = getFightDetails(row);
      return fightSchema.parse(fightDetails); // Validate fight data using Zod schema
    });

    // Create the fight event
    const fightEvent = {
      date: validatedEventDetails.date,
      eventName: validatedEventDetails.name,
      location: validatedEventDetails.location,
      card: fights
    };

    console.log('Event:', fightEvent);

    // Return the fight event object
    return fightEvent;

  } catch (error) {
    console.error('Error scraping data:', error);
    throw error;
  }
}


// Function to get the event details (event name, location, date, and event URL) from the target row
function getEventDetails(row: Element) {
  return eventSchema.parse({
    name: row.querySelector('td:nth-child(1) i a')?.textContent?.trim() || '',
    location: row.querySelector('td.b-statistics__table-col_style_big-top-padding')?.textContent?.trim() || '',
    date: row.querySelector('span.b-statistics__date')?.textContent?.trim() || '',
    eventUrl: row.querySelector('td:nth-child(1) i a')?.getAttribute('href') || '',
  });
}




function getFightDetails(row: HTMLTableRowElement) {
  const columns = row.querySelectorAll('td');
  
  // Directly validate the scraped data and return it
  return fightSchema.parse({
    name1: columns[1]?.querySelector('p')?.textContent?.trim() || 'Unknown',
    name2: columns[1]?.querySelectorAll('p')[1]?.textContent?.trim() || 'Unknown',
    weightClass: columns[6]?.querySelector('p')?.textContent?.trim() || 'Unknown',
    fightLink: row.getAttribute('data-link') || 'Unknown',
  });
}


// Function to get next page URL from a row
function getNextPageUrl(row: Element): string {
  const link = row.querySelector('a');
  return link ? link.href : '';
}
