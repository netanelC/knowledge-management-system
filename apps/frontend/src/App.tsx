import { useEffect, useState } from 'react';
import type { HealthResponse } from 'types';

function App() {
  const [status, setStatus] = useState<HealthResponse | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setStatus(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Knowledge Management System</h1>
      {status ? <pre>{JSON.stringify(status, null, 2)}</pre> : <p>Loading health status...</p>}
    </div>
  );
}

export default App;
