import type { MetaFunction } from "@remix-run/node";
import React, { useRef, useState } from "react";

import AutoAnimateContainer from "@/components/auto-animate-container";
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
import UploadedFileEntry, {
  UploadedFile,
} from "@/components/uploaded-file-entry";
import { formatTimeWithDescription, humanFileSize } from "@/utils";
import { UploadCloudIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { GITHUB_URL, GITHUB_USERNAME, MAX_SIZE } from "@/constants";
import { useImmerAtom } from "jotai-immer";
import { shouldUploadFilesTemporarilyAtom, uploadedFilesAtom } from "@/store";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAtom } from "jotai/react";

export const meta: MetaFunction = () => {
  return [
    { title: "File uploader - hoangvu12" },
    { name: "description", content: "Just a file uploader made by hoangvu12" },
  ];
};

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

  const handleSubmit = async () => {
    if (!files?.length) {
      return toast.error("Please select a file to upload.");
    }

    const totalSize = files.reduce((acc, file) => acc + file.size, 0);

    if (totalSize > MAX_SIZE) {
      return toast.error(
        `Total size of files exceeds the limit of ${humanFileSize(MAX_SIZE)}.`
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
      if (e.lengthComputable) {
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
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        setFiles([]);
        setIsUploading(false);
        xhrRef.current = null;
      }
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        setIsUploading(false);

        if (xhr.status === 200) {
          setFiles([]);

          const response = JSON.parse(xhr.response) as {
            success: boolean;
            files: UploadedFile[];
          };

          if (response.success) {
            toast.success("Files are uploaded successfully.");

            setUploadedFiles((draft) => {
              draft.unshift(...response.files);
            });
          } else {
            toast.error("Failed to upload files.");
          }
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

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Card className="my-16 w-full max-w-xl">
        <CardHeader>
          <CardTitle>
            Upload your file (Max size:
            {" " + humanFileSize(MAX_SIZE)})
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
            <ClientOnly fallback={<FileUploaderPlaceholder />}>
              {() => <FileUploader files={files} onChange={setFiles} />}
            </ClientOnly>

            {files.length > 0 ? (
              <React.Fragment>
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

                <div className="mt-4 flex justify-end gap-4">
                  {isUploading ? (
                    <div className="flex items-center gap-2">
                      <p className="text-sm tabular-nums">
                        {humanFileSize(loaded)} / {humanFileSize(total)}
                      </p>

                      <div className="size-1 rounded-md bg-primary" />

                      <p className="text-sm tabular-nums">{remainingTime}</p>
                    </div>
                  ) : null}

                  <Button onClick={isUploading ? abort : handleSubmit}>
                    {isUploading ? (
                      <XIcon size={16} />
                    ) : (
                      <UploadCloudIcon size={16} />
                    )}

                    <p className="ml-2">{isUploading ? "Cancel" : "Upload"}</p>
                  </Button>
                </div>
              </React.Fragment>
            ) : null}
          </div>

          {(uploadedFiles?.length || 0) > 0 ? (
            <AutoAnimateContainer className="mt-8">
              <p className="mb-2 text-lg font-semibold">
                Uploaded ({uploadedFiles.length})
              </p>

              <div className="space-y-2">
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
              </div>
            </AutoAnimateContainer>
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
}
