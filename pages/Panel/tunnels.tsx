import { useEffect, useState } from 'react';
import apiClient from '../../src/http/http';

type Tunnel = {
    id: number;
    name: string;
}

export default function MyComponent() {
    const [tunnel, setTunnel] = useState(null);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      apiClient
        .get('/modules/frp/hosts')
        .then((response) => {
          setTunnel(response);
          console.log(response)
        })
        .catch((error) => {
          setError(error);
        });
    }, []);
  
    if (error) {
      // handle error here
      return (
        <p>Error</p>
    );
    }
  
    // use data here
    return (
      <div>
        {tunnel ? tunnel.map((tunnel) => (
          <p key={tunnel.id}>{tunnel.name} {tunnel.protocol}</p>
        ))
        : <p>Loading…</p>}
      </div>
    );
  }