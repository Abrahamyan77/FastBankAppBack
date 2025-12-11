import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { seedDatabase } from './seeder.js';
import { client } from './database.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json());
app.get('/credits', (req, res) => {
  const { ClientID, Status, Branch, StartDate, EndDate } = req.query;
  
  let query = 'SELECT * FROM credits WHERE 1=1';
  const params = [];
  let paramIndex = 1;
  
  if (ClientID) {
    query += ` AND "ClientID" = $${paramIndex}`;
    params.push(ClientID);
    paramIndex++;
  }
  
  if (Status) {
    query += ` AND "Status" = $${paramIndex}`;
    params.push(Status);
    paramIndex++;
  }
  
  if (Branch) {
    query += ` AND "Branch" = $${paramIndex}`;
    params.push(Branch);
    paramIndex++;
  }
  
  if (StartDate && EndDate) {
    query += ` AND "ApplicationDate" >= $${paramIndex} AND "ApplicationDate" <= $${paramIndex + 1}`;
    params.push(StartDate, EndDate);
    paramIndex += 2;
  } else if (StartDate) {
    query += ` AND "ApplicationDate" >= $${paramIndex}`;
    params.push(StartDate);
    paramIndex++;
  } else if (EndDate) {
    query += ` AND "ApplicationDate" <= $${paramIndex}`;
    params.push(EndDate);
    paramIndex++;
  }
  
  client.query(query, params, (err, result) => {
    if (err) {
      console.error('Error fetching credits:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    return res.json(result.rows);
  });
});

app.get('/clients', (req, res) => {
  const query = `
    SELECT DISTINCT "ClientID"
    FROM credits
    WHERE "ClientID" IS NOT NULL
    ORDER BY "ClientID"
  `;
  
  client.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching clients:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const clientIds = result.rows.map(row => row.ClientID);
    return res.json(clientIds);
  });
});

app.get('/kpi/status', (req, res) => {
  const statusQuery = `
    SELECT 
      "Status",
      COUNT(*) as count
    FROM credits
    GROUP BY "Status"
  `;
  
  client.query(statusQuery, (err, statusResult) => {
    if (err) {
      console.error('Error fetching KPI data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    
    const statusCounts = {
      Canceled: 0,
      New: 0,
      'In Process': 0,
      Rejected: 0,
      Approved: 0
    };
    
    statusResult.rows.forEach(row => {
      if (statusCounts.hasOwnProperty(row.Status)) {
        statusCounts[row.Status] = parseInt(row.count);
      }
    });
    
    return res.json(statusCounts);
  });
});

app.get('/kpi/branch', (req, res) => {
  const branchQuery = `
    SELECT 
      "Branch" as branch,
      COUNT(*) as count
    FROM credits
    GROUP BY "Branch"
    ORDER BY count DESC
  `;
  
  client.query(branchQuery, (err, branchResult) => {
    if (err) {
      console.error('Error fetching branch KPI data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    
    const branchCounts = branchResult.rows.map(row => ({
      branch: row.branch,
      count: parseInt(row.count)
    }));
    
    return res.json(branchCounts);
  });
});

(async () => {
  try {
    await client.connect();
    await seedDatabase();
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();




