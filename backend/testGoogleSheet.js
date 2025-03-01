import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

// Authenticate using google-auth-library
const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Initialize the Google Spreadsheet
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);

async function testGoogleSheet() {
    try {
        await doc.loadInfo(); // Loads document properties and worksheets
        console.log(`Title: ${doc.title}`);
        
        const sheet = doc.sheetsByIndex[0]; // Get first sheet
        console.log(`Sheet title: ${sheet.title}, Rows: ${sheet.rowCount}`);

        // Add a test row
        await sheet.addRow({ Name: 'Test User', Email: 'test@example.com' });

        console.log('✅ Test row added successfully!');
    } catch (error) {
        console.error('❌ Error accessing Google Sheet:', error);
    }
}

testGoogleSheet();
