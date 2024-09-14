import { humanFileSize } from "@/utils";
import {
  FileAudioIcon,
  FileIcon,
  FileImageIcon,
  FileVideoIcon,
  XIcon,
} from "lucide-react";
import React from "react";
import { Button } from "./ui/button";

export enum FileType {
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  FILE = "file",
}

export interface FileEntryProps {
  file: File;
  onRemove?: () => void;
}

const detectFileType = (file: File) => {
  const type = file.type;

  if (type.includes("image")) {
    return FileType.IMAGE;
  }

  if (type.includes("video")) {
    return FileType.VIDEO;
  }

  if (type.includes("audio")) {
    return FileType.AUDIO;
  }

  return FileType.FILE;
};

const fileTypeToIcon = {
  [FileType.IMAGE]: FileImageIcon,
  [FileType.VIDEO]: FileVideoIcon,
  [FileType.AUDIO]: FileAudioIcon,
  [FileType.FILE]: FileIcon,
};

const FileEntry: React.FC<FileEntryProps> = ({ file, onRemove }) => {
  const fileType = detectFileType(file);
  const FileIcon = fileTypeToIcon[fileType];

  return (
    <div className="relative grid grid-cols-11 items-center gap-4 rounded-xl border-2 border-border p-3 transition-[border] duration-300 hover:border-foreground">
      <div className="flex justify-center">
        <FileIcon size={24} className="col-span-1" />
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

          <Button
            variant="destructive"
            className="col-span-1"
            onClick={onRemove}
          >
            <XIcon size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FileEntry;
