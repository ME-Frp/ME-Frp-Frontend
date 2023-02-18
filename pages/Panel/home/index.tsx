import { useEffect, useState } from 'react';
import apiClient from '../../../src/http/http';

export default function MyComponent() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiClient
      .get('/users')
      .then((response) => {
        setData(response);
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  if (error) {
    // handle error here
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    // handle loading state here
    return <div>Loading...</div>;
  }

  // use data here
  return <div>Data: {JSON.stringify(data)}</div>;
}