import React, { useEffect, useMemo, useState } from 'react';
import { getInventory, updateInventoryStatus } from '../../api/client';
import type { InventoryItem, Status } from '../../types/models';
import ShelfBadge from '../components/ShelfBadge';
import StatusSelect from '../components/StatusSelect';

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setItems(await getInventory());
      } catch (e: any) {
        setError(e?.message ?? String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, InventoryItem[]>();
    for (const it of items) {
      const c = it.category ?? 'Pantry';
      if (!map.has(c)) map.set(c, []);
      map.get(c)!.push(it);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [items]);

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>3) Inventory</h3>
      {loading && <p>Loading…</p>}
      {error && <p className="err">{error}</p>}

      {!loading && grouped.map(([cat, list]) => (
        <div key={cat} style={{ marginTop: 14 }}>
          <h4 style={{ marginBottom: 6 }}>{cat} <span className="pill">{list.length}</span></h4>
          <table>
            <thead><tr><th>Item</th><th>Expiry</th><th>Shelf</th><th>Status</th></tr></thead>
            <tbody>
              {list.map((it) => (
                <tr key={it.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{it.name}</div>
                    <div style={{ color: '#666', fontSize: 12 }}>bought: {it.purchaseDate} · id: {it.id.slice(0,8)}</div>
                  </td>
                  <td>{it.predictedExpiryDate}</td>
                  <td><ShelfBadge level={it.shelfLevel} /></td>
                  <td>
                    <StatusSelect value={it.status} onChange={async (s: Status) => {
                      const updated = await updateInventoryStatus(it.id, s);
                      setItems((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
                    }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
