import axios, { endpoints } from "@/utils/axios";

export async function uploadFiles(files: File[]) {
  try {
    const form = new FormData();

    files.forEach((file) => {
      form.append("files", file, file.name);
    });

    const response = await axios.post(endpoints.upload, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data ;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}

export async function deleteFile(id: number) {
  try {
    const response = await axios.delete(`${endpoints.upload}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete failed:", error);
    throw error;
  }
}

export async function updateFileInfo(fileId: number, duration: number) {
  try {
    const form = new FormData();
    // use alternativeText to save file duration
    const newFileData = {
      alternativeText: duration,
    };

    form.append("fileInfo", JSON.stringify(newFileData));

    const response = await axios.post(
      `${endpoints.upload}?id=${fileId}`,
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data ;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}
