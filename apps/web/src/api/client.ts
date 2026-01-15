import type { ReceiptParseResponse, InventoryItem, ConfirmItem, Status } from '../types/models';

const API_BASE = '/api';

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function uploadReceipt(file: File): Promise<ReceiptParseResponse> {
  const form = new FormData();
  form.append('image', file);
  const res = await fetch(`${API_BASE}/receipts`, { method: 'POST', body: form });
  return handle<ReceiptParseResponse>(res);
}

export async function confirmReceipt(receiptId: string, purchaseDate: string, items: ConfirmItem[]): Promise<InventoryItem[]> {
  const res = await fetch(`${API_BASE}/receipts/${receiptId}/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ purchaseDate, items }),
  });
  return handle<InventoryItem[]>(res);
}

export async function getInventory(): Promise<InventoryItem[]> {
  const res = await fetch(`${API_BASE}/inventory`);
  return handle<InventoryItem[]>(res);
}

export async function updateInventoryStatus(itemId: string, status: Status): Promise<InventoryItem> {
  const res = await fetch(`${API_BASE}/inventory/${itemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return handle<InventoryItem>(res);
}

export async function resetDemo(): Promise<{ ok: boolean }> {
  const res = await fetch(`${API_BASE}/demo/reset`, { method: 'POST' });
  return handle<{ ok: boolean }>(res);
}
