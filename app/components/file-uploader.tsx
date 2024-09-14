import { cn } from "@/lib/utils";
import { CloudUploadIcon, FilePlusIcon } from "lucide-react";
import React from "react";
import ReactFileUploading from "react-files-uploading";
import AutoAnimateContainer from "./auto-animate-container";
import FileEntry from "./file-entry";

interface FileUploaderProps {
  files: File[];
  onChange: (files: File[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ files, onChange }) => {
  return (
    <ReactFileUploading multiple value={files} onChange={onChange}>
      {({ fileList, isDragging, onFileUpload, dragProps, onFileRemove }) => {
        const showFileList = fileList.length > 0;

        return (
          <AutoAnimateContainer>
            {showFileList ? (
              <div>
                <p className="mb-2 text-lg font-semibold">
                  Added ({files.length})
                </p>

                <AutoAnimateContainer className="space-y-2">
                  {files.map((file, index) => (
                    <FileEntry
                      key={file.name}
                      file={file}
                      onRemove={() => {
                        onFileRemove(index);
                      }}
                    />
                  ))}

                  <button
                    className={cn(
                      "relative border-dashed grid w-full grid-cols-11 items-center gap-4 rounded-xl border-2 p-3 transition-[border] duration-300 hover:border-foreground",
                      isDragging
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-foreground"
                    )}
                    onClick={onFileUpload}
                    {...dragProps}
                  >
                    <div className="col-span-1 flex justify-center">
                      <FilePlusIcon size={24} className="" />
                    </div>

                    <div className="col-span-10 flex w-full items-center gap-1">
                      <p className="font-semibold">
                        Click to upload or drag and drop
                      </p>
                    </div>
                  </button>
                </AutoAnimateContainer>
              </div>
            ) : (
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
            )}
          </AutoAnimateContainer>
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
