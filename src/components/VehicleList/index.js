import React, { useMemo, useState } from 'react';
import useData from './useData';
import VehicleCard from '../VehicleCard';
import VehicleSearch from '../VehicleSearch';
import { filterVehicles } from '../../utils/searchVehicles';
import './style.scss';

export default function VehicleList() {
  const [loading, error, vehicles] = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVehicles = useMemo(
    () => filterVehicles(vehicles, searchTerm),
    [vehicles, searchTerm],
  );

  if (loading) {
    return <div className="VehicleList__status" data-testid="loading">Loading</div>;
  }

  if (error) {
    return <div className="VehicleList__status" data-testid="error" role="alert">{ error }</div>;
  }

  if (vehicles.length === 0) {
    return <div className="VehicleList__status" data-testid="empty">No vehicles available right now.</div>;
  }

  return (
    <>
      <VehicleSearch onSearch={setSearchTerm} />
      {filteredVehicles.length === 0 ? (
        <div className="VehicleList__status" data-testid="no-results" role="status">
          No vehicles match your search.
        </div>
      ) : (
        <ul className="VehicleList" data-testid="results">
          {filteredVehicles.map((vehicle, index) => (
            <li className="VehicleList__item" key={vehicle.id} style={{ '--stagger-index': index }}>
              <VehicleCard vehicle={vehicle} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
