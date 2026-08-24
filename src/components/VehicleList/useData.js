import { useState, useEffect } from 'react';
import getData from '../../api';

export default function useData() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadVehicles() {
      try {
        const response = await getData();
        if (isMounted) setVehicles(response);
      } catch (err) {
        if (isMounted) setError(err.message || String(err));
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadVehicles();

    return () => { isMounted = false; };
  }, []);

  return [
    loading,
    error,
    vehicles,
  ];
}
