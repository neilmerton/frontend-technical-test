import React, { useEffect, useState } from 'react';
import useDebouncedValue from './useDebouncedValue';
import './style.scss';

const DEBOUNCE_MS = 250;

export default function VehicleSearch({ onSearch }) {
  const [term, setTerm] = useState('');
  const debouncedTerm = useDebouncedValue(term, DEBOUNCE_MS);

  useEffect(() => {
    onSearch(debouncedTerm);
  }, [debouncedTerm, onSearch]);

  return (
    <div className="VehicleSearch">
      <label className="VehicleSearch__label" htmlFor="vehicle-search">
        Search vehicles
        <input
          id="vehicle-search"
          type="search"
          className="VehicleSearch__input"
          placeholder="Search by name, description, or details…"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          autoComplete="off"
        />
      </label>
    </div>
  );
}
