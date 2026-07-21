import { useEffect, useState } from 'react';
import type { Asset } from 'types';

interface AssetListProps {
  refreshKey: number;
}

export function AssetList({ refreshKey }: AssetListProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = async () => {
    try {
      const res = await fetch('/api/assets');
      if (!res.ok) throw new Error('Failed to fetch assets');
      const data = await res.json();
      setAssets(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching assets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="asset-list-container loading">
        <div className="spinner"></div>
        <p>Loading your documents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="asset-list-container">
        <div className="alert error">
          <p className="alert-title">Failed to load assets</p>
          <p className="alert-body">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="asset-list-container">
      <div className="asset-list-header">
        <h2 className="asset-list-title">Uploaded Documents</h2>
        <span className="asset-count">
          {assets.length} file{assets.length !== 1 ? 's' : ''}
        </span>
      </div>

      {assets.length === 0 ? (
        <div className="assets-empty">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="empty-icon"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <p>No documents uploaded yet.</p>
        </div>
      ) : (
        <div className="asset-grid">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="asset-card"
              style={{ animationDelay: `${Math.random() * 0.3}s` }}
            >
              <div className="asset-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div className="asset-info">
                <h3 className="asset-filename" title={asset.filename}>
                  {asset.filename}
                </h3>
                <p className="asset-date">
                  {new Date(asset.createdAt).toLocaleDateString()} &middot;{' '}
                  {new Date(asset.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
