export async function handleUpload(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "fleemgt");
  formData.append("cloud_name", "dyomgcbln");

  // Detect resource type based on file type
  const isPdf = file.type === "application/pdf";
  const resourceType = isPdf ? "raw" : "image"; // PDFs -> raw, Images -> image

  const uploadUrl = import.meta.env.VITE_CLOUDINARY_URL+`/${resourceType}/upload`;

  const res = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "Upload failed");
  }

  return data.secure_url as string;
}
