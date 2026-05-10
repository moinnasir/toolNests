'use client';

import { useCallback, useId, useState } from 'react';

export type FileDropzoneProps = {
  accept?: string;
  label?: string;
  hint?: string;
  maxSizeMB?: number;
  onFile: (file: File | null) => void;
  disabled?: boolean;
};

export default function FileDropzone({
  accept = 'image/*',
  label = 'Drop a file here or browse',
  hint,
  maxSizeMB = 25,
  onFile,
  disabled,
}: FileDropzoneProps) {
  const inputId = useId();
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState('');

  const validate = useCallback(
    (file: File) => {
      const max = maxSizeMB * 1024 * 1024;
      if (file.size > max) {
        setError(`File is larger than ${maxSizeMB} MB.`);
        return false;
      }
      setError('');
      return true;
    },
    [maxSizeMB],
  );

  const pick = useCallback(
    (file: File | null) => {
      if (!file) {
        onFile(null);
        setError('');
        return;
      }
      if (!validate(file)) {
        onFile(null);
        return;
      }
      onFile(file);
    },
    [onFile, validate],
  );

  return (
    <div className="space-y-2">
      <label className="label" htmlFor={inputId}>
        {label}
      </label>
      <div
        role="button"
        tabIndex={0}
        aria-disabled={disabled}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            document.getElementById(inputId)?.click();
          }
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          if (!disabled) setDrag(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          if (disabled) return;
          const f = e.dataTransfer.files?.[0];
          if (f) pick(f);
        }}
        className={`flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${
          disabled ? 'cursor-not-allowed opacity-50' : ''
        } ${drag ? 'border-blue-500 bg-blue-50/60' : 'border-slate-200 bg-slate-50/50 hover:border-blue-300 hover:bg-blue-50/40'}`}
        onClick={() => !disabled && document.getElementById(inputId)?.click()}
      >
        <span className="text-sm font-semibold text-slate-800">Drag and drop or click to upload</span>
        <span className="mt-1 text-xs text-slate-500">Max {maxSizeMB} MB{hint ? ` · ${hint}` : ''}</span>
        <input
          id={inputId}
          className="sr-only"
          type="file"
          accept={accept}
          disabled={disabled}
          onChange={(e) => pick(e.target.files?.[0] || null)}
        />
      </div>
      {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}
    </div>
  );
}
