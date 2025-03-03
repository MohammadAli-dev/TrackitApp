// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

// Import required modules
import express from 'express';
import cors from 'cors';
// GoogleSpreadsheet is used to interact with Google Sheets
import { GoogleSpreadsheet } from 'google-spreadsheet';
// JWT is used for authenticating with Google APIs
import { JWT } from 'google-auth-library';

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS for cross-origin requests
app.use(cors());
// Parse incoming JSON payloads
app.use(express.json());

// Google Sheets Authentication using google-auth-library
// Create a JWT client using credentials from environment variables
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL, // Service account email from .env
  // Replace literal "\n" with actual newline characters in the private key
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Google Sheets Setup: Create a new GoogleSpreadsheet instance using the spreadsheet ID from .env
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID, serviceAccountAuth);

// Function to connect to Google Sheets and load document info
async function connectGoogleSheet() {
  try {
    // Loads document properties and worksheets
    await doc.loadInfo();
    console.log(`✅ Connected to Google Sheets: ${doc.title}`);
    if (doc.sheetsByIndex && doc.sheetsByIndex.length > 0) {
      const sheet = doc.sheetsByIndex[0];
      try {
        // Log header values for debugging purposes
        console.log("Header values:", sheet.headerValues);
      } catch (err) {
        console.log("Warning: Header values are not yet loaded");
      }
    } else {
      console.log("No sheets found in the document.");
    }
  } catch (error) {
    console.error('❌ Google Sheets connection error:', error);
  }
}

// Initiate connection to Google Sheets
connectGoogleSheet();

// Route to add a new lead to the Google Sheet
app.post('/add-lead', async (req, res) => {
  try {
    // Destructure expected fields from the request body (expects camelCase keys)
    const { businessName, contactPerson, phone, address, location, comments } = req.body;
    // Get the first sheet from the document
    const sheet = doc.sheetsByIndex[0];

    // Add a new row to the sheet with the provided lead data and current date
    await sheet.addRow({
      BusinessName: businessName,
      ContactPerson: contactPerson,
      Phone: phone,
      Address: address,
      Location: location,
      Comments: comments,
      Date: new Date().toLocaleString(),
    });

    // Send a successful response back to the client
    res.status(200).json({ message: 'Lead added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add lead' });
  }
});

// Route to fetch all leads from the Google Sheet
app.get('/get-leads', async (req, res) => {
  try {
    // Get the first sheet from the document
    const sheet = doc.sheetsByIndex[0];
    // Retrieve all rows from the sheet
    const rows = await sheet.getRows();

    // Define the header keys in the order expected
    const header = [
      'BusinessName',
      'ContactPerson',
      'Phone',
      'Address',
      'Location',
      'Comments',
      'Date'
    ];

    // Convert each row's raw data into an object using the header keys
    let leads = [];
    rows.forEach(item => {
      // Map each header key to the corresponding value in the row's raw data array
      const obj = Object.fromEntries(header.map((k, i) => [k, item._rawData[i]]));
      leads.push(obj);
    });

    // Send the leads as a JSON response
    res.status(200).json(leads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// Start the server on the specified port
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
