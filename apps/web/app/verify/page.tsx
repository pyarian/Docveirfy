'use client';
import { useState } from 'react';


//import styles from './Verify.module.css';


import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Verify() {

  const [rawText, setRawText] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    // OLD
//const { extractTextFromPDF } = await import('../../../../packages/edge-sdk/src/pdfExtractor');

// NEW
    const { extractTextBrowser } = await import('@docverify/edge-sdk/src/extractors/browser');

  
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large (max 10 MB).');
      return;
    }
    setError('');
    setRawText(''); 
    setLoading(true);
    try {
      const text = await extractTextBrowser(file);
      setRawText(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally { setLoading(false);}
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Verify Document</h1>
      <WalletMultiButton />
      <br /><br />
      <input
        disabled={loading}
        type="file"
        accept=".pdf"
        onClick={e => { (e.target as HTMLInputElement).value = ''; }}
        onChange={handleFile}
      />
      {loading && <p>Extracting text…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {rawText && (
        <section aria-label='Extracted Text'>
        <pre style={{ background: '#f5f5f5', padding: '1rem', marginTop: '1rem',
                      maxHeight: '400px', overflow: 'auto', fontSize: '12px' }}>
          {rawText}
        </pre>
        </section>
      )}
    </main>
  );
}
