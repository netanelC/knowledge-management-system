import { useEffect, useState, useCallback } from 'react';
import type { Asset } from '../../backend/src/types';

export const AssetList = ({ refreshTrigger }: { refreshTrigger?: number }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/assets');
      if (!res.ok) throw new Error('Failed to fetch assets');
      const data = await res.json();
      setAssets(data.assets || []);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error fetching assets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets, refreshTrigger]);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (loading && assets.length === 0) {
    return (
      <div className="asset-list-container">
        <h2 className="asset-list-title">Your Documents</h2>
        <div className="empty-state">Loading...</div>
      </div>
    );
  }

  return (
    <div className="asset-list-container">
      <h2 className="asset-list-title">Your Documents</h2>

      {error && (
        <div className="alert error">
          <div className="alert-title">Error</div>
          <div className="alert-body">{error}</div>
        </div>
      )}

      {assets.length === 0 && !error ? (
        <div className="empty-state">
          <p>No documents uploaded yet.</p>
        </div>
      ) : (
        <div className="asset-grid">
          {assets.map((asset) => (
            <div key={asset.id} className="asset-card" title={asset.filename}>
              <div className="asset-icon">📄</div>
              <div className="asset-filename">{asset.filename}</div>
              <div className="asset-meta">
                {formatSize(asset.size)} • {new Date(asset.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
