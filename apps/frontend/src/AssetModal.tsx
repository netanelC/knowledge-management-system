import { useEffect, useState, useRef } from 'react';
import { formatSize, parseKeywords, type Asset } from '@backend/types';

import { API_BASE } from './config';

export type AssetModalProps = {
  asset: Asset;
  onClose: () => void;
};

export const AssetModal = ({ asset, onClose }: AssetModalProps) => {
  const [textContent, setTextContent] = useState<string | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [contentError, setContentError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    // Focus the modal for keyboard navigation
    modalRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  useEffect(() => {
    if (asset.type === 'TEXT') {
      const fetchContent = async () => {
        try {
          setLoadingContent(true);
          const res = await fetch(`${API_BASE}/api/assets/${asset.id}/content`);
          if (!res.ok) throw new Error('Failed to load document content');
          const text = await res.text();
          setTextContent(text);
          setContentError(null);
        } catch (err: unknown) {
          setContentError(err instanceof Error ? err.message : 'Failed to load content');
        } finally {
          setLoadingContent(false);
        }
      };

      fetchContent();
    }
  }, [asset]);

  const handleCopyText = async () => {
    if (textContent) {
      await navigator.clipboard.writeText(textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const contentUrl = `${API_BASE}/api/assets/${asset.id}/content`;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        ref={modalRef}
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
      >
        <div className="modal-header">
          <div className="modal-title-group">
            <h3 id="modal-title" className="modal-title">
              {asset.filename}
            </h3>
            <span className="modal-badge">{asset.type}</span>
          </div>

          <div className="modal-actions">
            {asset.type === 'TEXT' && textContent && (
              <button
                type="button"
                className="modal-btn secondary"
                onClick={handleCopyText}
                title="Copy document text"
              >
                {copied ? '✓ Copied' : '📋 Copy Text'}
              </button>
            )}

            <a
              href={contentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-btn primary"
              download={asset.filename}
            >
              ⬇ Open / Download
            </a>

            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-preview-column">
            {asset.type === 'IMAGE' ? (
              <div className="modal-image-wrapper">
                <img src={contentUrl} alt={asset.filename} className="modal-image-preview" />
              </div>
            ) : (
              <div className="modal-text-wrapper">
                <div className="modal-text-header">
                  <span>Document Content</span>
                </div>
                {loadingContent ? (
                  <div className="modal-content-loading">Loading text content...</div>
                ) : contentError ? (
                  <div className="alert error">{contentError}</div>
                ) : (
                  <pre className="modal-text-content">
                    {textContent || asset.extractedText || 'No text content available'}
                  </pre>
                )}
              </div>
            )}
          </div>

          <div className="modal-info-column">
            {asset.metadata && (
              <div className="modal-section">
                <h4 className="modal-section-title">✨ AI Insights</h4>
                {asset.metadata.description && (
                  <div className="modal-metadata-block">
                    <span className="modal-field-label">Summary</span>
                    <p className="modal-description">{asset.metadata.description}</p>
                  </div>
                )}
                {asset.metadata.keywords && (
                  <div className="modal-metadata-block">
                    <span className="modal-field-label">Keywords</span>
                    <div className="asset-tags">
                      {parseKeywords(asset.metadata.keywords).map((tag) => (
                        <span key={tag} className="asset-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="modal-section">
              <h4 className="modal-section-title">ℹ File Details</h4>
              <div className="modal-detail-row">
                <span className="modal-detail-label">File Size:</span>
                <span className="modal-detail-value">{formatSize(asset.size)}</span>
              </div>
              <div className="modal-detail-row">
                <span className="modal-detail-label">Format:</span>
                <span className="modal-detail-value">{asset.type}</span>
              </div>
              <div className="modal-detail-row">
                <span className="modal-detail-label">Uploaded:</span>
                <span className="modal-detail-value">
                  {new Date(asset.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="modal-detail-row">
                <span className="modal-detail-label">Asset ID:</span>
                <span className="modal-detail-value code-id">{asset.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
