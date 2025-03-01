# LeadTracker Backend API Documentation

## Overview
This backend is built with Node.js, Express, and the google-spreadsheet library. It uses a Google Sheet as its datastore and a Google Service Account for authentication. The API provides two main endpoints:
- **POST /add-lead:** Adds a new lead (record) to the Google Sheet.
- **GET /get-leads:** Retrieves all leads from the Google Sheet.

## Prerequisites
- **Node.js** (v14 or later recommended)
- **Google Service Account** with access to the Google Sheets API
- **Google Sheet** with a header row defining the following columns (in order):
  - BusinessName, ContactPerson, Phone, Address, Location, Comments, Date
- **.env file** in the backend folder containing the following variables:
  ```plaintext
  GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
  GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_CONTENT\n-----END PRIVATE KEY-----\n"
  GOOGLE_SHEET_ID=your_google_sheet_id_here
  PORT=5000
  ```
  Note:
  - The private key must be enclosed in double quotes.
  - The literal `\n` in the key will be replaced with actual newline characters in the code.

## Setup
1. **Clone/Download the Project:**
   Ensure that the backend code (e.g., server.js) and the .env file are in the same directory.
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Start the Server:**
   ```bash
   node server.js
   ```
   The console should print:
   ```plaintext
   🚀 Server running on http://localhost:5000
   ✅ Connected to Google Sheets: <Your Sheet Title>
   ```

## API Endpoints
### 1. Add a Lead
- **URL:** `/add-lead`
- **Method:** `POST`
- **Content-Type:** `application/json`
- **Description:** Adds a new lead (record) to the Google Sheet.
- **Request Body Example:**
  ```json
  {
    "businessName": "Test Business",
    "contactPerson": "John Doe",
    "phone": "9876543210",
    "address": "123 Street, City",
    "location": "25.276987, 55.296249",
    "comments": "This is a test lead"
  }
  ```
- **Response Example:**
  ```json
  {
    "message": "Lead added successfully!"
  }
  ```

### 2. Get Leads
- **URL:** `/get-leads`
- **Method:** `GET`
- **Description:** Retrieves all lead records from the Google Sheet.
- **Response Example:**
  ```json
  [
    {
      "BusinessName": "Test Business",
      "ContactPerson": "John Doe",
      "Phone": "9876543210",
      "Address": "123 Street, City",
      "Location": "25.276987, 55.296249",
      "Comments": "This is a test lead",
      "Date": "2/26/2025, 9:00:00 AM"
    },
    {
      "BusinessName": "Another Business",
      "ContactPerson": "Jane Doe",
      "Phone": "1234567890",
      "Address": "456 Avenue, City",
      "Location": "40.7128, -74.0060",
      "Comments": "Follow-up required",
      "Date": "2/27/2025, 10:15:00 AM"
    }
  ]
  ```

  Note:
  - If the returned JSON objects appear empty (e.g., `[{}, {}]`), verify that the header row in your Google Sheet exactly matches the field names used in the code. You can also check console logs for `sheet.headerValues` and `row._rawData` for further debugging.

## Debugging
- **Environment Variables:**
  If you encounter issues with authentication, add debug logs to print out `process.env.GOOGLE_PRIVATE_KEY` and other environment variables.
- **Console Logs:**
  The server logs header values and raw data when fetching leads. Check these logs to ensure the sheet headers are recognized correctly.
- **Google Sheet Access:**
  Make sure your Google Sheet is shared with your service account email (Editor access).

## Usage
1. **Start the Server:**
   Follow the Setup steps above to start your server.
2. **Test the Endpoints:**
   Use Postman, cURL, or any HTTP client to send requests to the API endpoints.
   - Use a `POST` request to `/add-lead` to add new records.
   - Use a `GET` request to `/get-leads` to retrieve all leads.
3. **Debug if Needed:**
   Refer to the debugging section if you encounter issues, and adjust your Google Sheet headers or environment variables as needed.
