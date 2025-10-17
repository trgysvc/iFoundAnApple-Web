import React, { useState, useRef } from 'react';

interface FileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  onFileSelect?: (files: FileList | null) => void;
  error?: string;
  helperText?: string;
  className?: string;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept = '*/*',
  multiple = false,
  maxSize = 10, // 10MB default
  onFileSelect,
  error,
  helperText,
  className = '',
  disabled = false,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    // Check file size
    const oversizedFiles = Array.from(files).filter(file => file.size > maxSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert(`Dosya boyutu ${maxSize}MB'dan büyük olamaz.`);
      return;
    }

    setSelectedFiles(files);
    onFileSelect?.(files);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    handleFiles(files);
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const baseClasses = 'w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors';
  const dragClasses = dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400';
  const errorClasses = error ? 'border-red-500 bg-red-50' : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  const finalClasses = `${baseClasses} ${dragClasses} ${errorClasses} ${disabledClasses} ${className}`;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div
        className={finalClasses}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />
        
        <div className="space-y-2">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          
          <div className="text-sm text-gray-600">
            <span className="font-medium text-blue-600 hover:text-blue-500">
              Dosya seçin
            </span>
            {' '}veya sürükleyip bırakın
          </div>
          
          <p className="text-xs text-gray-500">
            {accept !== '*/*' && `Desteklenen formatlar: ${accept}`}
            {maxSize && ` (Maksimum ${maxSize}MB)`}
          </p>
        </div>
      </div>

      {selectedFiles && selectedFiles.length > 0 && (
        <div className="mt-2">
          <p className="text-sm text-gray-600">
            Seçilen dosya{selectedFiles.length > 1 ? 'lar' : ''}: {selectedFiles.length}
          </p>
          <ul className="text-xs text-gray-500 mt-1">
            {Array.from(selectedFiles).map((file, index) => (
              <li key={index}>
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};


