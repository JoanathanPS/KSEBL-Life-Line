import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema.js';

const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL or SUPABASE_URL environment variable is required');
}

// Create the connection
const client = postgres(connectionString);
export const db = drizzle(client, { schema });