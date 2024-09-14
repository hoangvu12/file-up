import { atomWithStorage } from "jotai/utils";
import { UploadedFile } from "./components/uploaded-file-entry";

export const uploadedFilesAtom = atomWithStorage<UploadedFile[]>(
  "uploadedFiles",
  []
);
