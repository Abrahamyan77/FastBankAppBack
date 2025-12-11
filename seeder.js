import { client } from "./database.js";
import path from 'path';
import { fileURLToPath } from 'url';
import xlsx from 'xlsx';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS credits (
    ApplicationID VARCHAR(50) PRIMARY KEY,
    ClientID VARCHAR(50),
    Product VARCHAR(100),
    Branch VARCHAR(100),
    Status VARCHAR(50),
    ApplicationDate DATE,
    Phase1_Start DATE,
    Phase1_End DATE,
    Phase2_Start DATE,
    Phase2_End DATE,
    Phase3_Start DATE,
    Phase3_End DATE,
    FinalDecisionDate DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

function excelDateToJSDate(serial) {
  if (!serial || serial === '') return null;
  if (typeof serial === 'string') {
    return serial;
  }
  if (serial instanceof Date) {
    return serial.toISOString().split('T')[0];
  }
  if (typeof serial === 'number') {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    if (isNaN(date_info.getTime())) {
      return null;
    }
    return date_info.toISOString().split('T')[0];
  }
  return null;
}

export async function seedDatabase() {
  try {
    await client.query(createTableQuery);
    const countResult = await client.query('SELECT COUNT(*) FROM credits');
    const count = parseInt(countResult.rows[0].count);

    if (count > 0) {
      return;
    }
    const excelFilePath = path.join(__dirname, 'CreditConveyorData.xlsx');
    const workbook = xlsx.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    for (const row of data) {
      try {
        const insertQuery = `
          INSERT INTO credits (
            ApplicationID, ClientID, Product, Branch, Status,
            ApplicationDate, Phase1_Start, Phase1_End,
            Phase2_Start, Phase2_End, Phase3_Start, Phase3_End,
            FinalDecisionDate
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          ON CONFLICT (ApplicationID) DO NOTHING
        `;

        await client.query(insertQuery, [
          row.ApplicationID || null,
          row.ClientID || null,
          row.Product || null,
          row.Branch || null,
          row.Status || null,
          excelDateToJSDate(row.ApplicationDate),
          excelDateToJSDate(row.Phase1_Start),
          excelDateToJSDate(row.Phase1_End),
          excelDateToJSDate(row.Phase2_Start),
          excelDateToJSDate(row.Phase2_End),
          excelDateToJSDate(row.Phase3_Start),
          excelDateToJSDate(row.Phase3_End),
          excelDateToJSDate(row.FinalDecisionDate)
        ]);
      } catch (err) {
        console.log(err.message);
        
      }
    }
    
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}



