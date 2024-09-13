import { cn } from "@/lib/utils";
import { CloudUploadIcon } from "lucide-react";
import React from "react";
import ReactFileUploading from "react-files-uploading";

interface FileUploaderProps {
  files: File[];
  onChange: (files: File[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ files, onChange }) => {
  return (
    <ReactFileUploading multiple value={files} onChange={onChange}>
      {({ isDragging, onFileUpload, dragProps }) => {
        return (
          <button
            className={cn(
              `w-full rounded-lg border-2 border-dashed p-6 text-center transition-[border] duration-300`,
              isDragging
                ? "border-primary bg-primary/10"
                : "border-border hover:border-foreground"
            )}
            onClick={onFileUpload}
            {...dragProps}
          >
            <CloudUploadIcon className="mx-auto mb-2 size-16 text-foreground" />

            <p className="mb-2 mt-1 text-sm text-foreground">
              <span className="underline decoration-wavy underline-offset-1">
                Click to upload
              </span>

              <span> or drag and drop</span>
            </p>
          </button>
        );
      }}
    </ReactFileUploading>
  );
};

export const FileUploaderPlaceholder = () => {
  return (
    <div className="w-full rounded-lg border-2 border-dashed border-border p-6 text-center transition-[border] duration-300 hover:border-foreground">
      <CloudUploadIcon className="mx-auto mb-2 size-16 text-foreground" />

      <p className="mb-2 mt-1 text-sm text-foreground">
        <span className="underline decoration-wavy underline-offset-1">
          Click to upload
        </span>

        <span> or drag and drop</span>
      </p>
    </div>
  );
};

export default FileUploader;
