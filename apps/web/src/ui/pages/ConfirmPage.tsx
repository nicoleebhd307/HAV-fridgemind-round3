import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { confirmReceipt } from '../../api/client';
import { addManualItem, getConfirmedItems, getReceipt, updateConfirmedItem } from '../state/demoStore';

const CATEGORIES = ['Vegetables','Fruits','Meat','Seafood','Dairy','Eggs','Bakery','Frozen','Ready-to-eat','Pantry'];

export default function ConfirmPage() {
  const nav = useNavigate();
  const receipt = getReceipt();
  const items = getConfirmedItems();
  const [activeCat, setActiveCat] = useState<string>('Dairy');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const m = new Map<string, typeof items>();
    for (const c of CATEGORIES) m.set(c, []);
    for (const it of items) {
      const cat = (it.category ?? 'Pantry') as string;
      if (!m.has(cat)) m.set(cat, []);
      m.get(cat)!.push(it);
    }
    return m;
  }, [items]);

  if (!receipt) {
    return <div className="card"><p>No receipt loaded. Go back to Scan.</p></div>;
  }

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>2) Confirm items (category-first)</h3>
      <div className="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="row" style={{ alignItems: 'center' }}>
          <span className="pill">OCR: {receipt.ocrMode}</span>
          <span className="pill">Purchase date: {receipt.purchaseDate}</span>
        </div>
        <button className="btn secondary" onClick={() => addManualItem()}>+ Add item manually</button>
      </div>

      {receipt.warnings?.length ? <p className="warn">Warnings: {receipt.warnings.slice(0,4).join(', ')}{receipt.warnings.length>4?'…':''}</p> : null}

      <div className="grid" style={{ marginTop: 12 }}>
        {CATEGORIES.map((c) => (
          <div key={c} className={`cat ${activeCat === c ? 'active' : ''}`} onClick={() => setActiveCat(c)}>
            <div style={{ fontWeight: 600 }}>{c}</div>
            <div style={{ color: '#666', marginTop: 4 }}>{(grouped.get(c) ?? []).length} items</div>
          </div>
        ))}
      </div>

      <div style={{ height: 12 }} />

      <table>
        <thead><tr><th>Name</th><th>Qty</th><th>Unit</th><th>Price</th><th>Category</th></tr></thead>
        <tbody>
          {(grouped.get(activeCat) ?? []).map((it) => (
            <tr key={it.tempId}>
              <td><input value={it.name} onChange={(e) => updateConfirmedItem(it.tempId, { name: e.target.value })} style={{ width: '100%' }} /></td>
              <td><input type="number" value={it.quantity ?? 1} onChange={(e) => updateConfirmedItem(it.tempId, { quantity: Number(e.target.value) })} style={{ width: 80 }} /></td>
              <td><input value={it.unit ?? ''} onChange={(e) => updateConfirmedItem(it.tempId, { unit: e.target.value || null })} style={{ width: 90 }} /></td>
              <td><input type="number" value={it.price ?? ''} onChange={(e) => updateConfirmedItem(it.tempId, { price: e.target.value ? Number(e.target.value) : null })} style={{ width: 120 }} /></td>
              <td>
                <select value={it.category ?? 'Pantry'} onChange={(e) => updateConfirmedItem(it.tempId, { category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {error && <p className="err">{error}</p>}

      <div className="row" style={{ marginTop: 12, justifyContent: 'flex-end' }}>
        <button className="btn" disabled={busy} onClick={async () => {
          setBusy(true); setError(null);
          try {
            await confirmReceipt(receipt.receiptId, receipt.purchaseDate, items);
            nav('/inventory');
          } catch (e: any) {
            setError(e?.message ?? String(e));
          } finally {
            setBusy(false);
          }
        }}>
          {busy ? 'Saving...' : 'Save to my fridge'}
        </button>
      </div>
    </div>
  );
}
