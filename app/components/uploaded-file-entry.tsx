import { humanFileSize } from "@/utils";
import { DownloadIcon, FileIcon } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";

export interface UploadedFile {
  hash: string;
  name: string | number;
  url: string;
  size: number;
}

export interface UploadedFileEntryProps {
  file: UploadedFile;
}

const UploadedFileEntry: React.FC<UploadedFileEntryProps> = ({ file }) => {
  return (
    <div className="relative grid grid-cols-11 items-center gap-4 rounded-xl border-2 border-border p-3 transition-[border] duration-300 hover:border-foreground">
      <div className="col-span-1 flex justify-center">
        <FileIcon size={24} />
      </div>

      <div className="col-span-10 flex justify-between">
        <div className="grid w-full grid-cols-10 items-center">
          <div className="col-span-9">
            <div className="w-2/3">
              <p className="line-clamp-2 break-words text-base font-semibold leading-none tracking-tight">
                {file.name}
              </p>
            </div>

            <p className="text-sm">{humanFileSize(file.size)}</p>
          </div>

          <div className="col-span-1">
            <a href={file.url} target="_blank" rel="noreferrer">
              <Button
                variant="default"
                onClick={() => {
                  window.open(file.url, "_blank");
                }}
              >
                <DownloadIcon size={16} />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadedFileEntry;
