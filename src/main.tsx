
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { connectToMongoDB } from './services/mongodb.ts'

// Initialize MongoDB connection
// In a production app, this would come from environment variables
// For now, we'll use a placeholder - the user will need to replace this with their actual connection string
// const mongoConnectionString = "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority";
// Note: We're just setting up the infrastructure, the user will need to provide their actual connection string
// connectToMongoDB(mongoConnectionString, "docfinder").catch(console.error);

// Once the user provides the proper MongoDB connection details, they should uncomment the line above
// and replace the placeholder with their actual connection string.

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
