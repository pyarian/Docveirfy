import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './db';
import institutionRouter from './routes/institution';
import institutionHashesRouter from './routes/institutionHashes';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'docverify-api-gateway'
  });
});

app.get('/v1/verify/:id', (req, res) => {
  res.json({ stub: true, id: req.params.id });
});

app.post('/v1/verify', async (req, res) => {
  try {
    const {
      user_hash,
      institution_id,
      doc_type
    } = req.body;

    // Basic validation
    if (!user_hash || !institution_id || !doc_type) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Search database for matching hash
    const { data, error } = await supabase
      .from("institution_hashes")
      .select("*")
      .eq("doc_hash", user_hash)
      .eq("institution_id", institution_id)
      .eq("doc_type", doc_type)
      .limit(1);

    if (error) {
      throw error;
    }

    // Match found
    if (data && data.length > 0) {
      return res.json({
        verified: true,
        message: "Document verified successfully"
      });
    }

    // No match
    return res.json({
      verified: false,
      message: "No matching document found"
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.get('/v1/institutions', (req, res) => {
  res.json({ stub: true, institutions: [] });
});

// Institution registration route
app.use('/v1/institution', institutionRouter);

app.use('/v1/institution/hashes', institutionHashesRouter);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});