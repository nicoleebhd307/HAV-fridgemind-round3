import React from 'react';
import type { ShelfLevel } from '../../types/models';

export default function ShelfBadge({ level }: { level: ShelfLevel }) {
  const label = level === 'EAT_NOW' ? 'Eat now' : level === 'USE_SOON' ? 'Use soon' : 'Safe';
  return <span className="pill">{label}</span>;
}
