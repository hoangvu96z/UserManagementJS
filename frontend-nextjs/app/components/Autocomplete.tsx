'use client';

import { useMemo, useState } from 'react';
import { Country } from '../../types/user';

interface AutocompleteProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  items: Country[];
  placeholder?: string;
}

export default function Autocomplete({ label, value, onChange, items, placeholder }: AutocompleteProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const term = query.toLowerCase();
    return items.filter((item) => item.name.toLowerCase().includes(term)).slice(0, 10);
  }, [items, query]);

  return (
    <div>
      <label className="form-label">{label}</label>
      <input
        type="text"
        className="form-control"
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
        }}
        list="country-list"
      />
      <datalist id="country-list">
        {filtered.map((item) => (
          <option key={item.code} value={item.name} />
        ))}
      </datalist>
    </div>
  );
}
