import { useState } from 'react';
import type { FormEvent } from 'react';
import type { AssetUploadResponse } from 'types';
import { getErrorMessage } from './utils/error';

interface UploadFormProps {
  onUploadSuccess?: () => void;
}

export function UploadForm({ onUploadSuccess }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadResponse, setUploadResponse] = useState<AssetUploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
        throw new Error(`Upload failed with status ${res.status}`);
      }

      const data: AssetUploadResponse = await res.json();
      setUploadResponse(data);
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'An error occurred during upload'));
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
            Select a document (.txt, .md, .csv) or image
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".txt,.md,.csv,image/*"
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
            Database UUID: <strong>{uploadResponse.asset.id}</strong>
          </p>
          <pre className="json-view">{JSON.stringify(uploadResponse, null, 2)}</pre>
        </div>
      )}
    </main>
  );
}
