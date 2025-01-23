import { z } from 'zod';

// Define the 'Event' schema
export const eventSchema = z.object({
  eventId: z.number().int().optional(), // Primary key
  eventName: z.string(),
  eventUrl: z.string(),
  eventDate: z.string(), // or `z.date()` if you want to parse date objects
  eventLocation: z.string(),
});

export const fightSchema = z.object({
    id: z.number().int(), // Primary key
    event_id: z.number().int(), // Foreign key referencing Event
    red_fighter_id: z.number().int(), // Foreign key referencing Fighter (red corner)
    blue_fighter_id: z.number().int(), // Foreign key referencing Fighter (blue corner)
    weight_class: z.string(),
    url: z.string(),
    title: z.boolean(),
    interim_title: z.boolean(),
  });

// Define the 'Fighter' schema
export const fighterSchema = z.object({
  id: z.number().int(), // Primary key
  name: z.string(),
  gender: z.enum(['M', 'F']), // Enum for gender: Male or Female
  url: z.string(),
  
});

// Define the 'Fight' schema


// Define the 'FightResults' schema
export const fightResultsSchema = z.object({
  id: z.number().int(), // Primary key
  fight_id: z.number().int(), // Foreign key referencing Fight
  fighter_id: z.number().int(), // Foreign key referencing Fighter
  performance_bonus: z.boolean(),
  fight_bonus: z.boolean(),
  outcome: z.string(),
  method: z.string(),
  time: z.string(), // Time of the fight, could be a string format or number of seconds
  round: z.number().int(),
});

// Define TypeScript types from the Zod schemas
export type Event = z.infer<typeof eventSchema>;
export type Fighter = z.infer<typeof fighterSchema>;
export type Fight = z.infer<typeof fightSchema>;
export type FightResults = z.infer<typeof fightResultsSchema>;
