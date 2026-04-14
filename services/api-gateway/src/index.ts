import express from 'express';
import cors from 'cors';
import institutionRouter from './routes/institution';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
import { supabase } from './db';

app.get('/test-db', async (req, res) => {
  const { data, error } = await supabase
    .from('institutions')
    .select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ tables_ok: true, row_count: data.length, rows: data });
});
app.use('/v1/institution', institutionRouter);
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'docverify-api-gateway'
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});