import { useEffect, useState, useCallback } from 'react';
import { formatSize, parseKeywords, type Asset } from '@backend/types';
import { AssetModal } from './AssetModal';

import { API_BASE } from './config';

export const AssetList = ({ refreshTrigger }: { refreshTrigger?: number }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const fetchAssets = useCallback(async (query?: string) => {
    try {
      setLoading(true);
      const url = query?.trim()
        ? `${API_BASE}/api/assets?q=${encodeURIComponent(query.trim())}`
        : `${API_BASE}/api/assets`;
      const res = await fetch(url);
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
    const timer = setTimeout(() => {
      fetchAssets(searchQuery);
    }, 250);

    return () => clearTimeout(timer);
  }, [fetchAssets, searchQuery, refreshTrigger]);

  return (
    <div className="asset-list-container">
      <div className="asset-list-header">
        <h2 className="asset-list-title">Your Documents</h2>
        <div className="search-bar-container">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Smart Search (filename, summary, tags)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              title="Clear search"
              type="button"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="alert error">
          <div className="alert-title">Error</div>
          <div className="alert-body">{error}</div>
        </div>
      )}

      {loading && assets.length === 0 ? (
        <div className="empty-state">Loading...</div>
      ) : assets.length === 0 && !error ? (
        <div className="empty-state">
          {searchQuery ? (
            <p>No documents found matching "{searchQuery}".</p>
          ) : (
            <p>No documents uploaded yet.</p>
          )}
        </div>
      ) : (
        <div className="asset-grid">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="asset-card"
              title={`Click to view ${asset.filename}`}
              onClick={() => setSelectedAsset(asset)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedAsset(asset);
                }
              }}
            >
              <div className="asset-icon">
                {asset.type === 'IMAGE' ? (
                  <img
                    src={`${API_BASE}/api/assets/${asset.id}/content`}
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
                {asset.metadata ? (
                  <div className="asset-ai-metadata">
                    <div className="asset-ai-header">
                      <span className="asset-ai-badge">✨ AI Summary</span>
                    </div>
                    {asset.metadata.description && (
                      <p className="asset-description">{asset.metadata.description}</p>
                    )}
                    {asset.metadata.keywords && (
                      <div className="asset-tags">
                        {parseKeywords(asset.metadata.keywords).map((tag) => (
                          <span key={tag} className="asset-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="asset-ai-metadata">
                    <span className="asset-no-ai">No AI metadata</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedAsset && <AssetModal asset={selectedAsset} onClose={() => setSelectedAsset(null)} />}
    </div>
  );
};
