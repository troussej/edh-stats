import path from 'node:path';
import process from 'node:process';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';

// The scope for reading spreadsheets.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The path to the credentials file.
const CREDENTIALS_PATH = path.join(process.cwd(), 'src/config/credentials.json');

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
async function listMajors() {

    const auth = new google.auth.GoogleAuth({
        keyFile: CREDENTIALS_PATH,
        scopes: SCOPES,
    });

    // Create a new Sheets API client.
    const sheets = google.sheets({ version: 'v4', auth });
    // Get the values from the spreadsheet.
    const result = await sheets.spreadsheets.values.get({
        spreadsheetId: '1O2WhGWtjwE_vLjgyhuTNTioY_3ua-S2lP8aiKu_hd_I',
        range: 'Games!A2:E',
    });
    const rows = result.data.values;
    if (!rows || rows.length === 0) {
        console.log('No data found.');
        return;
    }
    console.log('Horodateur	Date	Lieu	Mon deck ?	Gagnant ?');
    // Print the name and major of each student.
    rows.forEach((row) => {
        // Print columns A and E, which correspond to indices 0 and 4.
        console.log(`${row[0]}, ${row[1]}, ${row[2]}, ${row[3]}, ${row[4]}`);
    });
}

await listMajors();