import type { ReceiptParseResponse, ConfirmItem } from '../../types/models';

type Store = {
  receipt: ReceiptParseResponse | null;
  confirmedItems: ConfirmItem[];
};

const store: Store = { receipt: null, confirmedItems: [] };

export function setReceipt(r: ReceiptParseResponse) {
  store.receipt = r;
  store.confirmedItems = r.items.map((it) => ({
    tempId: it.tempId,
    name: it.name,
    category: it.category,
    quantity: it.quantity,
    unit: it.unit,
    price: it.price,
  }));
}

export function getReceipt() { return store.receipt; }
export function getConfirmedItems() { return store.confirmedItems; }

export function updateConfirmedItem(tempId: string, patch: Partial<ConfirmItem>) {
  store.confirmedItems = store.confirmedItems.map((it) => (it.tempId === tempId ? { ...it, ...patch } : it));
}

export function addManualItem() {
  const nextId = `m${Date.now()}`;
  store.confirmedItems = [
    { tempId: nextId, name: 'New item', category: 'Pantry', quantity: 1, unit: null, price: null },
    ...store.confirmedItems,
  ];
}
