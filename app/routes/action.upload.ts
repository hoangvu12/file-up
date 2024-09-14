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

  const newFormData = new FormData();

  files.forEach((file) => {
    newFormData.append("files[]", file);
  });

  const response = await fetch("https://up1.fileditch.com/upload.php", {
    method: "POST",
    body: newFormData,
  });

  const responseData = (await response.json()) as {
    success: boolean;
    files: string[];
  };

  if (!response.ok) {
    return json(
      { success: false, error: "Error uploading file" },
      { status: 400 }
    );
  }

  return json({ success: true, files: responseData.files });
};
