import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Google Sheets Authentication using google-auth-library
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Google Sheets Setup: Inject authentication into the constructor
const doc = new GoogleSpreadsheet('1VZGhdFtc-lEjbLgRHuB2KiMRvNn5fvC_L0FR5tf2F9U', serviceAccountAuth);

async function connectGoogleSheet() {
  try {
    await doc.loadInfo(); // Loads document properties and worksheets
    console.log(`✅ Connected to Google Sheets: ${doc.title}`);
    if (doc.sheetsByIndex && doc.sheetsByIndex.length > 0) {
        const sheet = doc.sheetsByIndex[0];
        try {
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

connectGoogleSheet();
  
// Route to add a lead
app.post('/add-lead', async (req, res) => {
  try {
    const { businessName, contactPerson, phone, address, location, comments } = req.body;
    const sheet = doc.sheetsByIndex[0];

    await sheet.addRow({
      BusinessName: businessName,
      ContactPerson: contactPerson,
      Phone: phone,
      Address: address,
      Location: location,
      Comments: comments,
      Date: new Date().toLocaleString(),
    });

    res.status(200).json({ message: 'Lead added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add lead' });
  }
});

// Route to fetch leads
app.get('/get-leads', async (req, res) => {
    try {
      const sheet = doc.sheetsByIndex[0];
      const rows = await sheet.getRows();
  
      // Use the headerValues from the sheet to build each lead object.
      // const leads = rows.map(row => {
        let lead = [];
        // For each header, get the corresponding value from the row.
        rows.forEach(item => {
          // lead[item] = row[header];
          lead.push(item._rawData);
          console.log("logging rows  - ", item)
        });
        // return lead;
      // });
  
      res.status(200).json(lead);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch leads' });
    }
  });
  

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
