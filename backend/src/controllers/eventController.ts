import { z } from 'zod';  // <-- Add this import
import { eventSchema } from '../../../shared/zodSchemas'; // Import the Zod schema for validation
import Event from '../models/events';  // Import the Sequelize model

// Function to handle creating a new event
export const createEvent = async (eventData: any) => {
  try {
    // Use Zod to validate the event data
    const validatedEvent = eventSchema.parse(eventData);  // This will throw if validation fails
    
    // If validation passes, create the event in the database
    const newEvent = await Event.create(validatedEvent);

    return newEvent;  // Return the created event
  } catch (error) {
    if (error instanceof z.ZodError) {
      // If validation fails, handle the Zod validation error
      throw new Error('Validation failed: ' + error.errors.map(err => err.message).join(', '));
    } else {
      // For any other error, propagate it
      throw error;
    }
  }
};
