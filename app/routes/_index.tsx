import type { MetaFunction } from "@remix-run/node";
import React, { useEffect, useRef, useState } from "react";

import AutoAnimateContainer from "@/components/auto-animate-container";
import BigUploadArrow from "@/components/big-upload-arrow";
import { ClientOnly } from "@/components/client-only";
import FileUploader, {
  FileUploaderPlaceholder,
} from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import UploadButtonArrow from "@/components/upload-button-arrow";
import UploadedFileEntry, {
  UploadedFile,
} from "@/components/uploaded-file-entry";
import {
  GITHUB_URL,
  GITHUB_USERNAME,
  MAX_SIZE_TEMP,
  MAX_SIZE as NAX_FILE_PERM,
} from "@/constants";
import { shouldUploadFilesTemporarilyAtom, uploadedFilesAtom } from "@/store";
import { formatTimeWithDescription, humanFileSize } from "@/utils";
import { useImmerAtom } from "jotai-immer";
import { useAtom } from "jotai/react";
import { UploadCloudIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

// https://github.com/emilkowalski/sonner/issues/386#issuecomment-2286569378
import "../styles/sonner.css";

export const meta: MetaFunction = () => {
  return [
    { title: "File uploader - hoangvu12" },
    { name: "description", content: "Just a file uploader made by hoangvu12" },
    {
      property: "og:image",
      content: "https://small.fileditchstuff.me/s16/QjbtvUsZklsIVPXrFyA.png",
    },
  ];
};

const getMaxFile = (isTemp: boolean) =>
  isTemp ? MAX_SIZE_TEMP : NAX_FILE_PERM;

export default function Index() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useImmerAtom(uploadedFilesAtom);
  const [isUploading, setIsUploading] = useState(false);
  const [loaded, setLoaded] = useState(0);
  const [total, setTotal] = useState(1);
  const [remainingTime, setRemainingTime] = useState("");
  const [shouldUploadFilesTemporarily, setShouldUploadFilesTemporarily] =
    useAtom(shouldUploadFilesTemporarilyAtom);

  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const MAX_FILE = getMaxFile(shouldUploadFilesTemporarily);

  const handleSubmit = async () => {
    if (!files?.length) {
      return toast.error("Please select a file to upload.");
    }

    const totalSize = files.reduce((acc, file) => acc + file.size, 0);

    if (totalSize > MAX_FILE) {
      return toast.error(
        `Total size of files exceeds the limit of ${humanFileSize(MAX_FILE)}.`
      );
    }

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files[]", file);
    });

    const xhr = new XMLHttpRequest();

    setIsUploading(true);

    const uploadUrl = shouldUploadFilesTemporarily
      ? "https://up1.fileditch.com/temp/upload.php"
      : "https://up1.fileditch.com/upload.php";

    xhr.open("POST", uploadUrl, true);

    xhr.upload.onprogress = (e) => {
      if (!e.lengthComputable) return;

      setLoaded(e.loaded);
      setTotal(e.total || 1);

      const uploadedBytes = e.loaded;
      const totalBytes = e.total;
      const elapsedTime =
        (Date.now() - (startTimeRef.current || Date.now())) / 1000;
      const uploadSpeed = uploadedBytes / elapsedTime;
      const remainingBytes = totalBytes - uploadedBytes;
      const remainingTime = remainingBytes / uploadSpeed;

      setRemainingTime(formatTimeWithDescription(remainingTime));
    };

    xhr.onload = () => {
      if (xhr.status !== 200) return;

      setFiles([]);
      setIsUploading(false);
      xhrRef.current = null;
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return;

      setIsUploading(false);

      if (xhr.status !== 200) {
        const response = JSON.parse(xhr.response) as {
          success: false;
          errorcode: number;
          description: string;
        };

        if (response.description) {
          toast.error(response.description);
        } else {
          toast.error("Failed to upload files.");
        }

        return;
      }

      setFiles([]);

      const response = JSON.parse(xhr.response) as
        | {
            success: true;
            files: UploadedFile[];
          }
        | {
            success: false;
            errorcode: number;
            description: string;
          };

      if (response.success) {
        toast.success("Files are uploaded successfully.");

        setUploadedFiles((draft) => {
          const files = response.files.map((file) => ({
            ...file,
            isTemp: shouldUploadFilesTemporarily,
            uploadedAt: Date.now(),
          }));

          draft.unshift(...files);
        });
      } else {
        if (response.description) {
          toast.error(response.description);
        } else {
          toast.error("Failed to upload files.");
        }
      }
    };

    xhr.onerror = () => {
      setIsUploading(false);

      toast.error("Something went wrong, failed to upload files.");
    };

    xhr.send(formData);

    startTimeRef.current = Date.now();

    xhrRef.current = xhr;
  };

  const abort = () => {
    xhrRef.current?.abort();
    setIsUploading(false);

    toast.info("Uploading process is cancelled.");
  };

  useEffect(() => {
    window.onbeforeunload = (e) => {
      if (!isUploading) return null;

      e = e || window.event;

      if (e) {
        e.returnValue =
          "Are you sure you want to leave this page? Your upload will be cancelled.";
      }

      return "Are you sure you want to leave this page? Your upload will be cancelled.";
    };
  }, [isUploading]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Card className="my-16 w-full max-w-xl">
        <CardHeader>
          <CardTitle>
            Upload your file (Max size:
            {" " + humanFileSize(MAX_FILE)})
          </CardTitle>
          <CardDescription>
            You can upload photos, documents, music, videos and more.
            <p>
              Made with ❤️ by{" "}
              <a
                target="_blank"
                href={GITHUB_URL}
                className="transition-colors duration-300 hover:text-primary"
                rel="noreferrer"
              >
                {GITHUB_USERNAME}
              </a>
            </p>
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6">
          <div className="w-full space-y-4">
            <div className="relative">
              <ClientOnly fallback={<FileUploaderPlaceholder />}>
                {() => <FileUploader files={files} onChange={setFiles} />}
              </ClientOnly>

              <AutoAnimateContainer className="absolute -left-48 top-1/2 -translate-y-1/2">
                {!files.length ? <BigUploadArrow /> : null}
              </AutoAnimateContainer>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <Label
                htmlFor="should-upload-files-temporarily"
                className="font-semibold"
              >
                Upload temporarily (delete after 72 hours)
              </Label>

              <Switch
                id="should-upload-files-temporarily"
                checked={shouldUploadFilesTemporarily}
                onCheckedChange={setShouldUploadFilesTemporarily}
              />
            </div>

            {files.length > 0 ? (
              <React.Fragment>
                <div className="relative mt-4 flex justify-end gap-4">
                  <AutoAnimateContainer className="flex items-center">
                    {isUploading && loaded && total && remainingTime ? (
                      <div className="flex items-center gap-2">
                        <p className="text-sm tabular-nums">
                          {humanFileSize(loaded)} / {humanFileSize(total)}
                        </p>

                        <div className="size-1 rounded-md bg-primary" />

                        <p className="text-sm tabular-nums">{remainingTime}</p>
                      </div>
                    ) : null}
                  </AutoAnimateContainer>

                  <Button onClick={isUploading ? abort : handleSubmit}>
                    {isUploading ? (
                      <XIcon size={16} />
                    ) : (
                      <UploadCloudIcon size={16} />
                    )}

                    <p className="ml-2">{isUploading ? "Cancel" : "Upload"}</p>
                  </Button>

                  <AutoAnimateContainer className="absolute -right-40 -top-2">
                    <UploadButtonArrow />
                  </AutoAnimateContainer>
                </div>
              </React.Fragment>
            ) : null}
          </div>

          <AutoAnimateContainer>
            {(uploadedFiles?.length || 0) > 0 ? (
              <div className="mt-8">
                <p className="mb-2 text-lg font-semibold">
                  Uploaded ({uploadedFiles.length})
                </p>

                <AutoAnimateContainer className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <UploadedFileEntry
                      key={file.hash}
                      file={file}
                      onRemove={() => {
                        setUploadedFiles((draft) => {
                          draft.splice(index, 1);
                        });
                      }}
                    />
                  ))}
                </AutoAnimateContainer>
              </div>
            ) : null}
          </AutoAnimateContainer>
        </CardContent>
      </Card>
    </main>
  );
}
