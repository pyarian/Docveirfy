import { Router, Request, Response } from 'express';
import { supabase } from '../db';
import { createVerify } from 'crypto';

const router = Router();

router.post('/', async (req: Request, res: Response) => {

  // ── STEP 1: Validate required fields ──────────────────────────────
  const {
    institution_id,
    doc_hash,
    signature,
    doc_type,
    doc_ref_id,
    issued_at
  } = req.body;

  if (!institution_id || !doc_hash || !signature || !doc_type || !doc_ref_id || !issued_at) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['institution_id', 'doc_hash', 'signature', 'doc_type', 'doc_ref_id', 'issued_at']
    });
  }

  // ── STEP 2: Check API key ──────────────────────────────────────────
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(401).json({ error: 'Missing X-API-Key header' });
  }

  // ── STEP 3: Look up institution ────────────────────────────────────
  const { data: institution, error: instError } = await supabase
    .from('institutions')
    .select('id, name, public_key_hex, status, api_key')
    .eq('id', institution_id)
    .single();

  if (instError || !institution) {
    return res.status(401).json({ error: 'Institution not found' });
  }

  // Verify API key matches
  if (institution.api_key && institution.api_key !== apiKey) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  // Check institution is active
  if (institution.status !== 'active') {
    return res.status(403).json({
      error: 'Institution is not active',
      status: institution.status
    });
  }

  // ── STEP 4: Verify Ed25519 signature ──────────────────────────────
  // Only verify if institution has a public key registered
  // For MVP during development, skip if no key is set yet
  if (institution.public_key_hex) {
    try {
      // CRITICAL: verify raw bytes not hex strings
      const pubKeyBuffer = Buffer.from(institution.public_key_hex, 'hex');
      const hashBuffer   = Buffer.from(doc_hash, 'hex');
      const sigBuffer    = Buffer.from(signature, 'base64');

      const pubKeyObj = {
        key: pubKeyBuffer,
        format: 'der' as const,
        type: 'spki' as const
      };

      const isValid = createVerify('Ed25519')
        .update(hashBuffer)
        .verify(pubKeyObj, sigBuffer);

      if (!isValid) {
        return res.status(400).json({ error: 'Signature verification failed' });
      }
    } catch (err) {
      console.error('Signature verification error:', err);
      return res.status(400).json({ error: 'Invalid signature format' });
    }
  } else {
    // No public key set yet — log warning but allow for MVP development
    console.warn(`Institution ${institution_id} has no public key — skipping signature check`);
  }

  // ── STEP 5: Deduplicate ────────────────────────────────────────────
  // Reject if same doc_ref_id already submitted by this institution
  const { data: existing } = await supabase
    .from('institution_hashes')
    .select('id')
    .eq('institution_id', institution_id)
    .eq('doc_ref_id', doc_ref_id)
    .single();

  if (existing) {
    return res.status(409).json({
      error: 'Hash already submitted',
      message: `doc_ref_id ${doc_ref_id} already exists for this institution`
    });
  }

  // ── STEP 6: Store the hash ─────────────────────────────────────────
  const { data: inserted, error: insertError } = await supabase
    .from('institution_hashes')
    .insert({
      institution_id,
      doc_hash,
      signature,
      doc_type,
      doc_ref_id,
      issued_at,
      status: 'active'
    })
    .select('id, submitted_at')
    .single();

  if (insertError) {
    console.error('Insert error:', insertError);
    return res.status(500).json({ error: 'Failed to store hash' });
  }

  // ── STEP 7: Write audit log ────────────────────────────────────────
  await supabase.from('audit_events').insert({
    event_type:  'hash_submitted',
    actor_id:    institution_id,
    actor_type:  'institution',
    resource_id: inserted.id,
    metadata: {
      doc_type,
      doc_ref_id,
      doc_hash_prefix: doc_hash.slice(0, 8) // only first 8 chars for privacy
    }
  });

  // ── RESPONSE ───────────────────────────────────────────────────────
  return res.status(201).json({
    hash_id:      inserted.id,
    accepted:     true,
    submitted_at: inserted.submitted_at
  });

});

export default router;