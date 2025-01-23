import { eventSchema } from '../../../shared/zodSchemas';
import Event from '../models/events';
import { z } from 'zod';


// Use the inferred TypeScript type from Zod
type EventData = z.infer<typeof eventSchema>;

// Function to handle creating a new event
export const createEvent = async (eventData: EventData) => {
  try {
    // Use the inferred type directly in the function
    const newEvent = await Event.create({
      eventName: eventData.eventName,
      eventUrl: eventData.eventUrl,
      eventDate: eventData.eventDate,
      eventLocation: eventData.eventLocation,
    });

    return newEvent;  // Return the created event
  } catch (error) {
    throw error;  // Propagate errors
  }
};
