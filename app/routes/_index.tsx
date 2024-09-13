import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";

import { ClientOnly } from "@/components/client-only";
import FileEntry from "@/components/file-entry";
import FileUploader, {
  FileUploaderPlaceholder,
} from "@/components/file-uploader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const meta: MetaFunction = () => {
  return [
    { title: "Media uploader - hoangvu12" },
    { name: "description", content: "It's private" },
  ];
};

export default function Index() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Card className="my-16 w-full max-w-xl">
        <CardHeader>
          <CardTitle>Upload your file</CardTitle>
          <CardDescription>
            You can upload photos, documents, music, videos and more.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6">
          <div className="w-full space-y-4">
            <ClientOnly fallback={<FileUploaderPlaceholder />}>
              {() => <FileUploader files={files} onChange={setFiles} />}
            </ClientOnly>
          </div>

          {files.length > 0 ? (
            <div className="mt-8 space-y-2">
              {files.map((file) => (
                <FileEntry key={file.name} file={file} />
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
}
