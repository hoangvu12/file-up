import { Progress } from "@/components/ui/progress";
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

const FileEntry: React.FC<FileEntryProps> = ({ file }) => {
  const fileType = detectFileType(file);
  const FileIcon = fileTypeToIcon[fileType];

  return (
    <div className="relative grid grid-cols-11 gap-4 rounded-xl border-2 border-border p-3 transition-[border] duration-300 hover:border-foreground">
      <div className="flex justify-center">
        <FileIcon size={24} className="col-span-1" />
      </div>

      <div className="col-span-10">
        <div className="w-2/3">
          <p className="line-clamp-2 break-words text-base font-semibold leading-none tracking-tight">
            {file.name}
          </p>
        </div>

        <p className="text-sm">{humanFileSize(file.size)}</p>

        <div className="flex w-full items-center gap-4">
          <Progress value={50} className="h-2.5 grow" />

          <p className="text-sm font-semibold tabular-nums">50%</p>
        </div>
      </div>

      <Button
        variant="outline"
        className="absolute right-2 top-2 border-0 bg-transparent p-1 hover:bg-black/10 dark:hover:bg-white/20"
      >
        <XIcon size={24} />
      </Button>
    </div>
  );
};

export default FileEntry;
