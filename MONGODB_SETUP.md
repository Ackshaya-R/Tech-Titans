
# MongoDB Setup Instructions

This application is set up to work with MongoDB. Follow these steps to connect your MongoDB database:

## Prerequisites

1. You need a MongoDB Atlas account or a MongoDB server
2. You need your MongoDB connection string

## Connection Setup

1. Open the `src/main.tsx` file
2. Uncomment the MongoDB connection code
3. Replace the placeholder connection string with your actual MongoDB connection string:

```typescript
// Replace this with your actual MongoDB connection string
const mongoConnectionString = "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority";
connectToMongoDB(mongoConnectionString, "docfinder").catch(console.error);
```

## MongoDB Connection String Format

For MongoDB Atlas, your connection string should look like:
```
mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

Replace:
- `username` with your MongoDB Atlas username
- `password` with your MongoDB Atlas password
- `cluster` with your cluster name

## Database Structure

The application expects the following collections in your MongoDB database:

1. `doctors` - Stores information about doctors
2. `appointments` - Stores appointment information

## Initializing Collections

If you need to create these collections and add initial data, you can use the MongoDB Atlas interface or write a script using the MongoDB service provided in this application.

## Security Considerations

For production use:
- Store your MongoDB connection string in environment variables
- Set up proper authentication and authorization
- Configure network access rules in MongoDB Atlas

## Troubleshooting

If you encounter connection issues:
1. Check if your IP address is whitelisted in MongoDB Atlas
2. Verify your username and password
3. Ensure your MongoDB Atlas cluster is running
4. Check the browser console for error messages
