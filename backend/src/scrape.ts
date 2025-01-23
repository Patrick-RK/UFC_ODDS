import axios from 'axios';
import { JSDOM } from 'jsdom';
import { eventSchema, fightSchema } from '../../shared/zodSchemas'; // Import the Zod schemas for validation
import { z } from 'zod';  // Zod import for validation
import Event from './models/events';  // Sequelize Event model

const fetchDataFromUrl = async (url: string) => {
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    return document;
  } catch (error) {
    console.error('Error fetching data from URL:', error);
    throw new Error('Error fetching data from URL');
  }
};

// Function to get the event details (event name, location, date, and event URL) from the target row
function getEventDetails(row: Element) {
  const eventDetails = {
    eventName: row.querySelector('td:nth-child(1) i a')?.textContent?.trim() || '',
    eventLocation: row.querySelector('td.b-statistics__table-col_style_big-top-padding')?.textContent?.trim() || '',
    eventDate: row.querySelector('span.b-statistics__date')?.textContent?.trim() || '',
    eventUrl: row.querySelector('td:nth-child(1) i a')?.getAttribute('href') || '',
  };


  const event = eventSchema.parse(eventDetails);



  return event;
}

// Function to scrape match data from a given URL
function extractEventDetails(document: Document) {
   
    const tbody = document.querySelector('tbody');
    if (!tbody) throw new Error('No <tbody> found');
    const rows = tbody.querySelectorAll('tr');
    const targetRow = rows[1]; // Change this as needed to target the correct row

    if (!targetRow) throw new Error('Target row not found');
    console.log(targetRow)
    const eventDetails = getEventDetails(targetRow);
    const validatedEventDetails = eventSchema.parse(eventDetails); // Validate event data using Zod schema
    console.log(validatedEventDetails.eventUrl)


    // // Scrape data from the next page (if necessary)
    // const nextPageUrl = getNextPageUrl(targetRow);
    // const nextPageResponse = await axios.get(nextPageUrl);
    // const nextDom = new JSDOM(nextPageResponse.data);
    // const nextDocument = nextDom.window.document;
    // const nextTbody = nextDocument.querySelector('tbody');
    // if (!nextTbody) throw new Error('No <tbody> found on the next page');

    // const nextRows = nextTbody.querySelectorAll('tr');

    // // Use the separate getFightDetails function to get fight details for each row
    // const fights = Array.from(nextRows).map((row: HTMLTableRowElement) => {
    //   const fightDetails = getFightDetails(row);
    //   return fightSchema.parse(fightDetails); // Validate fight data using Zod schema
    // });

    // // Create the fight event
    // const fightEvent = {
    //   date: validatedEventDetails.eventDate,
    //   eventName: validatedEventDetails.eventName,
    //   location: validatedEventDetails.eventLocation,
    //   card: fights
    // };

    // console.log('Event:', fightEvent);

    // Return the fight event object
    return validatedEventDetails;
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


const saveEventToDatabase = async (validatedEventDetails: any) => {
  try {
    // Save the validated event data to the database using Sequelize
    const newEvent = await Event.create({
      eventName: validatedEventDetails.eventName,
      eventUrl: validatedEventDetails.eventUrl,
      eventDate: validatedEventDetails.eventDate,
      eventLocation: validatedEventDetails.eventLocation,
    });
    console.log("Event saved to database:", newEvent);
    return newEvent;
  } catch (error) {
    console.error("Error occurred while saving event:", error);
    throw error;
  }
};


const validateEventDetails = (eventDetails: any) => {
  try {
    // Validate the event details using the Zod schema
    const validatedEventDetails = eventSchema.parse(eventDetails);  // This will throw if invalid
    console.log("Validated event details:", validatedEventDetails); // Log validated data for debugging
    return validatedEventDetails;
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors from Zod
      console.error("Validation failed:", error.errors.map(err => err.message).join(', '));
      throw new Error('Validation failed: ' + error.errors.map(err => err.message).join(', '));
    } else {
      // Propagate other types of errors
      console.error("Unexpected error during validation:", error);
      throw error;
    }
  }
};






// Main function to scrape event data from a given URL
export async function scrapeMatchData(url: string) {
  try {
    // Fetch the page data
    const document = await fetchDataFromUrl(url);
    console.log("got document")
    // Extract event details from the page
    const eventDetails = extractEventDetails(document);
    console.log("extracted")
    // Validate the extracted event details
    const validatedEventDetails = validateEventDetails(eventDetails);
    console.log("validated")
    const savedEvent = await saveEventToDatabase(eventDetails); // Save to database
    console.log('saved')
    return validatedEventDetails;

  } catch (error) {
    console.error('Error scraping data:', error);
    throw error;
  }
}