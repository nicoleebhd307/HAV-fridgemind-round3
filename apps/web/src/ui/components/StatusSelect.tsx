import React from 'react';
import type { Status } from '../../types/models';

export default function StatusSelect({ value, onChange }: { value: Status; onChange: (s: Status) => void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as Status)}>
      <option value="in_fridge">in_fridge</option>
      <option value="consumed">consumed</option>
      <option value="trashed">trashed</option>
    </select>
  );
}
