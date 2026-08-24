import React from 'react';
import useData from './useData';
import VehicleCard from '../VehicleCard';
import './style.scss';

export default function VehicleList() {
  const [loading, error, vehicles] = useData();

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
    <ul className="VehicleList" data-testid="results">
      {vehicles.map((vehicle, index) => (
        <li className="VehicleList__item" key={vehicle.id} style={{ '--stagger-index': index }}>
          <VehicleCard vehicle={vehicle} />
        </li>
      ))}
    </ul>
  );
}
