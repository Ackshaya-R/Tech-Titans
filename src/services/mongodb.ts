
import { MongoClient, ServerApiVersion } from 'mongodb';

// This would ideally come from environment variables
// For now we'll use a placeholder - in production this should be secured
let uri = "";
let dbName = "docfinder";
let client: MongoClient | null = null;

/**
 * Connect to MongoDB - can be called on app initialization
 * @param connectionString The MongoDB connection string
 * @param database The database name to use
 */
export const connectToMongoDB = async (connectionString: string, database: string) => {
  if (!connectionString) {
    console.error("MongoDB connection string is required");
    return null;
  }
  
  uri = connectionString;
  dbName = database;
  
  try {
    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    
    // Connect the client to the server
    await client.connect();
    console.log("Connected successfully to MongoDB");
    
    return client;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return null;
  }
};

/**
 * Get the MongoDB client instance
 */
export const getMongoClient = () => {
  if (!client) {
    console.warn("MongoDB client not initialized. Call connectToMongoDB first.");
  }
  return client;
};

/**
 * Get a database instance
 * @param dbName Optional database name (uses default if not provided)
 */
export const getDatabase = (name?: string) => {
  if (!client) {
    console.warn("MongoDB client not initialized. Call connectToMongoDB first.");
    return null;
  }
  return client.db(name || dbName);
};

/**
 * Close the MongoDB connection
 */
export const closeMongoConnection = async () => {
  if (client) {
    await client.close();
    client = null;
    console.log("MongoDB connection closed");
  }
};
