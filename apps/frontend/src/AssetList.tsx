import { useEffect, useState, useCallback } from 'react';
import { AssetFormat, type Asset } from '../../backend/src/types';
import { formatSize } from 'types';

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
              <div className="asset-icon">
                {asset.type === AssetFormat.IMAGE ? (
                  <img
                    src={`/api/assets/${asset.id}/content`}
                    alt={asset.filename}
                    className="asset-thumbnail"
                  />
                ) : (
                  '📄'
                )}
              </div>
              <div className="asset-details">
                <div className="asset-filename">{asset.filename}</div>
                <div className="asset-meta">
                  {formatSize(asset.size)} • {new Date(asset.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
