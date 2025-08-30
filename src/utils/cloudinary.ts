

export async function handleUpload(file:File){
    console.log(file)
     const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "fleemgt")
     formData.append("cloud_name", "dyomgcbln");
    console.log(import.meta.env.VITE_CLOUDINARY_URL)
    const res = await fetch(import.meta.env.VITE_CLOUDINARY_URL,
      {
        method: "POST",
        body: formData,
      }
    )
    const {secure_url}=await res.json()||''
    
    return secure_url
}