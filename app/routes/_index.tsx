import type { MetaFunction } from "@remix-run/node";
import { UploadIcon } from "lucide-react";
import { useCallback, useState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileName(file ? file.name : null);
  };

  const handleDragEnter = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(true);
    },
    []
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
    },
    []
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
    },
    []
  );

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    setFileName(file ? file.name : null);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl p-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold text-gray-900">File Uploader</h1>
        </div>
      </header>
      <main className="flex grow items-center justify-center px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div
                className={`rounded-lg border-2 border-dashed p-6 text-center ${
                  isDragging
                    ? "border-primary bg-primary/10"
                    : "border-gray-300"
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <UploadIcon className="mx-auto size-12 text-gray-400" />
                <p className="mt-1 text-sm text-gray-600">
                  Drag and drop your file here, or
                </p>
                <Input
                  id="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                  aria-describedby="file-upload-description"
                />
                <Button asChild className="mt-2">
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    Select a file
                  </Label>
                </Button>
              </div>
              {fileName ? (
                <p
                  className="text-center text-sm text-gray-500"
                  id="file-upload-description"
                >
                  Selected file: {fileName}
                </p>
              ) : (
                <p
                  className="text-center text-sm text-gray-500"
                  id="file-upload-description"
                >
                  No file selected
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
