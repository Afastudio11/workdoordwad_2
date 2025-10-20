import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure WebSocket for Neon with proper SSL handling
neonConfig.webSocketConstructor = ws;
neonConfig.pipelineConnect = false;

// Fix WebSocket certificate errors in development
// In development, Neon's WebSocket may use self-signed certificates
const isDevelopment = process.env.NODE_ENV !== 'production';
if (isDevelopment) {
  // Disable strict SSL verification for WebSocket connections in development only
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Configure SSL for development vs production
const isProduction = process.env.NODE_ENV === 'production';

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction 
    ? { rejectUnauthorized: true }  // Production: verify certs
    : { rejectUnauthorized: false } // Development: allow self-signed
});

export const db = drizzle({ client: pool, schema });
