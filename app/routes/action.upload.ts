import { MAX_SIZE } from "@/constants";
import { ActionFunctionArgs, json } from "@remix-run/node";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const files = formData.getAll("file") as File[];

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);

  if (totalSize > MAX_SIZE) {
    return json(
      { success: false, error: "Total size of files exceeds the limit of 5GB" },
      { status: 400 }
    );
  }

  // Upload files sequentially to Catbox
  const uploadedFiles = [];
  
  for (const file of files) {
    const newFormData = new FormData();
    newFormData.append("reqtype", "fileupload");
    newFormData.append("fileToUpload", file);

    const response = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: newFormData,
    });

    if (!response.ok) {
      return json(
        { success: false, error: `Error uploading file ${file.name}` },
        { status: 400 }
      );
    }

    const responseText = await response.text();
    const url = responseText.trim();
    
    if (url.startsWith("https://")) {
      uploadedFiles.push({
        name: file.name,
        url: url,
        size: file.size,
        hash: Date.now().toString() + uploadedFiles.length,
      });
    } else {
      return json(
        { success: false, error: `Failed to upload ${file.name}: ${responseText}` },
        { status: 400 }
      );
    }
  }

  return json({ success: true, files: uploadedFiles });
};
