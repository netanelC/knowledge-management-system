import { useEffect, useState } from 'react';
import type { HealthResponse } from 'types';
import { UploadForm } from './UploadForm';
import { AssetList } from './AssetList';

function App() {
  const [status, setStatus] = useState<HealthResponse | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setStatus(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Knowledge Base</h1>
        {status ? (
          <div className="health-status">
            <span className={`status-dot ${status.status === 'ok' ? 'ok' : 'error'}`}></span>
            <span>
              API: {status.status} | DB: {status.database} | S3: {status.storage}
            </span>
          </div>
        ) : (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Loading health status...
          </p>
        )}
      </header>

      <div className="app-content-grid">
        <UploadForm onSuccess={() => setRefreshTrigger((prev) => prev + 1)} />
        <AssetList refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}

export default App;
