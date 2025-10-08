"use client";

import { useState, useRef } from "react";

interface FileUploadProps {
  onFileLoad: (file: File, content: string) => void;
}

export function FileUpload({ onFileLoad }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith(".json")) {
      alert("Please upload a JSON file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileLoad(file, content);
    };
    reader.readAsText(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        border: `2px dashed ${isDragging ? 'var(--color-primary-500)' : 'var(--border-primary)'}`,
        padding: 'var(--space-12)',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
        background: isDragging ? 'var(--color-primary-50)' : 'var(--bg-primary)',
        borderRadius: 'var(--radius-base)'
      }}
      onMouseEnter={(e) => {
        if (!isDragging) {
          e.currentTarget.style.borderColor = 'var(--color-primary-300)';
          e.currentTarget.style.background = 'var(--bg-secondary)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isDragging) {
          e.currentTarget.style.borderColor = 'var(--border-primary)';
          e.currentTarget.style.background = 'var(--bg-primary)';
        }
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileInput}
        style={{ display: 'none' }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', alignItems: 'center' }}>
        <div style={{ color: isDragging ? 'var(--color-primary-500)' : 'var(--text-tertiary)' }}>
          <svg
            style={{
              width: '64px',
              height: '64px',
              transition: 'color var(--transition-fast)'
            }}
            stroke="currentColor"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        <div>
          <p style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-2)'
          }}>
            Drop your skillmap JSON file here
          </p>
          <p style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)'
          }}>
            or click to browse files
          </p>
        </div>
      </div>
    </div>
  );
}
