import { type ChangeEvent, useId, useRef } from "react";

import { Image as ImageIcon, Trash2, Upload } from "lucide-react";

import { cn } from "@/utils/cn";

export interface WriteImageUploadItem {
  id: string;
  name: string;
  sizeLabel?: string;
  thumbnailUrl?: string;
}

export interface WriteImageUploadFieldProps {
  id?: string;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  files?: WriteImageUploadItem[];
  maxFiles?: number;
  disabled?: boolean;
  accept?: string;
  className?: string;
  uploadButtonText?: string;
  onFilesSelect?: (files: FileList) => void;
  onRemoveFile?: (id: string) => void;
}

export const WriteImageUploadField = ({
  id,
  label,
  helperText,
  errorMessage,
  files = [],
  maxFiles = 5,
  disabled = false,
  accept = "image/png,image/jpeg,image/webp",
  className,
  uploadButtonText = "이미지를 드래그하거나 업로드하세요 (PNG, JPG ...)",
  onFilesSelect,
  onRemoveFile,
}: WriteImageUploadFieldProps) => {
  const fallbackId = useId();
  const uploadId = id ?? `write-image-upload-${fallbackId}`;
  const helperId = `${uploadId}-helper`;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;

    if (selectedFiles && selectedFiles.length > 0) {
      onFilesSelect?.(selectedFiles);
      event.target.value = "";
    }
  };

  const handleBrowseClick = () => {
    if (disabled) {
      return;
    }

    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <label className="text-label-04 text-text-tertiary" htmlFor={uploadId}>
          {label}
        </label>
      ) : null}

      <input
        ref={fileInputRef}
        id={uploadId}
        accept={accept}
        className="hidden"
        disabled={disabled}
        multiple
        onChange={handleInputChange}
        type="file"
      />

      <button
        aria-describedby={helperText || errorMessage ? helperId : undefined}
        className={cn(
          "flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed text-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-100",
          errorMessage
            ? "border-error-01 text-error-01"
            : "border-gray-300 text-text-tertiary hover:border-primary-300 hover:text-text-secondary",
          disabled &&
            "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-200 hover:text-gray-400",
        )}
        disabled={disabled}
        onClick={handleBrowseClick}
        type="button"
      >
        <Upload aria-hidden className="size-4" />
        <span className="truncate">{uploadButtonText}</span>
      </button>

      <div className="flex items-center justify-end">
        <p className="text-label-06 text-text-tertiary">
          {files.length}/{maxFiles}
        </p>
      </div>

      {files.length > 0 ? (
        <ul className="space-y-2">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                {file.thumbnailUrl ? (
                  <img
                    alt={file.name}
                    className="size-10 rounded-md border border-gray-200 object-cover"
                    src={file.thumbnailUrl}
                  />
                ) : (
                  <div className="flex size-10 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-400">
                    <ImageIcon aria-hidden className="size-4" />
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate text-label-04 text-text-secondary">
                    {file.name}
                  </p>
                  {file.sizeLabel ? (
                    <p className="text-label-06 text-text-tertiary">
                      {file.sizeLabel}
                    </p>
                  ) : null}
                </div>
              </div>

              <button
                aria-label={`${file.name} 삭제`}
                className="rounded-md p-2 text-error-01 transition-colors hover:bg-error-03/10 disabled:cursor-not-allowed disabled:text-gray-300"
                disabled={disabled}
                onClick={() => onRemoveFile?.(file.id)}
                type="button"
              >
                <Trash2 aria-hidden className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {helperText || errorMessage ? (
        <p
          className={cn(
            "text-label-06",
            errorMessage ? "text-error-01" : "text-text-tertiary",
          )}
          id={helperId}
          role={errorMessage ? "alert" : undefined}
        >
          {errorMessage ?? helperText}
        </p>
      ) : null}
    </div>
  );
};
