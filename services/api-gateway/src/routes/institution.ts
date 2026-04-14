import { Router, Request, Response } from 'express';
import { supabase } from '../db';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// POST /v1/institution/register
router.post('/register', async (req: Request, res: Response) => {

  const { name, sector, type, contact_email, signing_mode } = req.body;

  // 1. Validate required fields
  if (!name || !sector || !type || !contact_email) {
    return res.status(400).json({
      error: 'Missing required fields: name, sector, type, contact_email'
    });
  }

  // 2. Validate sector is one we support
  const validSectors = [
    'education', 'real_estate', 'finance',
    'healthcare', 'legal', 'transport', 'government', 'employment'
  ];
  if (!validSectors.includes(sector)) {
    return res.status(400).json({
      error: `Invalid sector. Must be one of: ${validSectors.join(', ')}`
    });
  }

  // 3. Generate API key for the institution
  const apiKey = `dk_${uuidv4().replace(/-/g, '')}`;

  // 4. Insert into Supabase
  const { data, error } = await supabase
    .from('institutions')
    .insert({
      name,
      sector,
      type,
      contact_email,
      signing_mode: signing_mode || 'hosted',
      status: 'pending',
      api_key: apiKey
    })
    .select()
    .single();

  if (error) {
    console.error('DB error:', error);
    return res.status(500).json({ error: 'Failed to register institution' });
  }

  // 5. Return the new institution
  res.status(201).json({
    message: 'Institution registered successfully. Pending KYB verification.',
    institution_id: data.id,
    name: data.name,
    sector: data.sector,
    status: data.status,
    api_key: apiKey
  });
});

export default router;