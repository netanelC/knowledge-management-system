import React, { useState, useRef } from 'react';
import type { FormEvent } from 'react';
import { ALLOWED_ALL_EXTENSIONS } from '@backend/types';
import type { Asset } from '@backend/types';

type UploadFormProps = {
  onSuccess?: () => void;
};

export const UploadForm: React.FC<UploadFormProps> = ({ onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadResponse, setUploadResponse] = useState<Asset | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setUploadResponse(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/assets', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const errorMessage =
          errorData?.error || errorData?.message || `Upload failed with status ${res.status}`;
        throw new Error(errorMessage);
      }

      const rawData = await res.json();
      const data: Asset = { ...rawData, createdAt: new Date(rawData.createdAt) };
      setUploadResponse(data);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="upload-card">
      <h2 className="upload-title">Upload Asset</h2>

      <form onSubmit={handleUpload}>
        <div className="file-input-group">
          <label htmlFor="file-upload" className="file-label">
            Select a file (Text or Image)
          </label>
          <input
            id="file-upload"
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_ALL_EXTENSIONS.join(',')}
            onChange={handleFileChange}
            className="file-input"
          />
        </div>

        <button
          type="submit"
          disabled={!file || isUploading}
          className={`btn-submit ${isUploading ? 'uploading' : ''}`}
        >
          {isUploading ? 'Uploading...' : 'Upload File'}
        </button>
      </form>

      {error && (
        <div className="alert error">
          <p className="alert-title">Error</p>
          <p className="alert-body">{error}</p>
        </div>
      )}

      {uploadResponse && (
        <div className="alert success">
          <p className="alert-title">Upload Successful!</p>
          <p className="alert-body">
            Database UUID: <strong>{uploadResponse.id}</strong>
          </p>
          <pre className="json-view">{JSON.stringify(uploadResponse, null, 2)}</pre>
        </div>
      )}
    </main>
  );
};
