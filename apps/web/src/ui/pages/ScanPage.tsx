import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadReceipt } from '../../api/client';
import { setReceipt } from '../state/demoStore';

export default function ScanPage() {
  const nav = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>1) Scan receipt</h3>
      <p style={{ marginTop: 0, color: '#555' }}>
        Upload a receipt image (WinMart / GO!). Demo mode uses fixtures (mock OCR) if image matches.
      </p>

      <div className="row" style={{ alignItems: 'center' }}>
        <input type="file" accept="image/*" onChange={(e) => { setError(null); setFile(e.target.files?.[0] ?? null); }} />
        <button className="btn" disabled={!file || busy} onClick={async () => {
          if (!file) return;
          setBusy(true);
          setError(null);
          try {
            const res = await uploadReceipt(file);
            setReceipt(res);
            nav('/confirm');
          } catch (e: any) {
            setError(e?.message ?? String(e));
          } finally {
            setBusy(false);
          }
        }}>
          {busy ? 'Processing...' : 'Process'}
        </button>
      </div>

      {error && <p className="err">{error}</p>}
    </div>
  );
}
