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
  client.query('SELECT * FROM credits', (err, result) => {
    if (err) {
      console.error('Error fetching credits:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  return res.json(result.rows);
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




