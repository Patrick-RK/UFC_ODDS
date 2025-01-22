import axios from 'axios';
import { JSDOM } from 'jsdom';

// Define a Fighter interface
interface Fight {
  name1: string;
  name2: string;
  weightClass: string;
}

// Define a FightEvent class to hold all event details and the fight card
class FightEvent {
  date: string;               // Date of the event
  eventName: string;          // Name of the event
  location: string;           // Location of the event
  card: Fight[];              // Array of fights

  constructor(date: string, eventName: string, location: string, fights: Fight[]) {
    this.date = date;
    this.eventName = eventName;
    this.location = location;
    this.card = fights;
  }

  // Method to display event details and fight information
  displayEvent() {
    console.log(`Event: ${this.eventName}`);
    console.log(`Date: ${this.date}`);
    console.log(`Location: ${this.location}`);
    console.log('Fights:');
    this.card.forEach((fight, index) => {
      console.log(`${index + 1}. ${fight.name1} vs ${fight.name2} (${fight.weightClass})`);
    });
  }
}

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

    // Get event data (event name, location, date, and event URL) by passing the target row
    const eventDetails = getEventDetails(targetRow); // Pass only the row, not the entire document
    const { name, location, date, eventUrl } = eventDetails;

    console.log(`Event Name: ${name}`);
    console.log(`Location: ${location}`);
    console.log(`Date: ${date}`);
    console.log(`Event URL: ${eventUrl}`);

    // Scrape data from the next page (if necessary)
    const nextPageUrl = getNextPageUrl(targetRow);
    const nextPageResponse = await axios.get(nextPageUrl);
    const nextDom = new JSDOM(nextPageResponse.data);
    const nextDocument = nextDom.window.document;
    const nextTbody = nextDocument.querySelector('tbody');
    if (!nextTbody) throw new Error('No <tbody> found on the next page');

    const nextRows = nextTbody.querySelectorAll('tr');
    const fights: Fight[] = Array.from(nextRows).map((row: HTMLTableRowElement) => {
      const columns = row.querySelectorAll('td');
      const redFighter = columns[1]?.querySelector('p')?.textContent?.trim() || 'Unknown';
      const blueFighter = columns[1]?.querySelectorAll('p')[1]?.textContent?.trim() || 'Unknown';
      const weightClass = columns[6]?.querySelector('p')?.textContent?.trim() || 'Unknown';

      // Get fight details
      return { name1: redFighter, name2: blueFighter, weightClass };
    });

    // Create an instance of the FightEvent class
    const fightEvent = new FightEvent(date, name, location, fights);
    fightEvent.displayEvent();

    // Return the fight event object
    return fightEvent;

  } catch (error) {
    console.error('Error scraping data:', error);
    throw error;
  }
}

// Function to get the event details (event name, location, date, and event URL) from the target row
function getEventDetails(row: Element): { name: string, location: string, date: string, eventUrl: string } {
  // Extract event name from the <a> inside <td> in the row
  const eventNameElement = row.querySelector('td:nth-child(1) i a');
  const eventName = eventNameElement ? eventNameElement.textContent?.trim() || '' : '';

  // Extract event URL (link) from the <a> inside <td> in the row
  const eventUrl = eventNameElement ? eventNameElement.getAttribute('href') || '' : '';

  // Extract event location from the <td> class that contains location details
  const locationElement = row.querySelector('td.b-statistics__table-col_style_big-top-padding');
  const location = locationElement ? locationElement.textContent?.trim() || '' : '';

  // Extract event date from the <span> with class "b-statistics__date"
  const dateElement = row.querySelector('span.b-statistics__date');
  const date = dateElement ? dateElement.textContent?.trim() || '' : '';
  
  return { name: eventName, location: location, date: date, eventUrl: eventUrl };
}

// Function to get next page URL from a row
function getNextPageUrl(row: Element): string {
  const link = row.querySelector('a');
  return link ? link.href : '';
}
