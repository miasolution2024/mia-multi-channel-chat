import axiosInstance from "@/utils/axios";
import axios, { endpoints } from "@/utils/axios";

// Interface for file upload response
export interface FileUploadResponse {
  data: {
    id: string;
    storage: string;
    filename_disk: string;
    filename_download: string;
    title: string;
    type: string;
    folder: string | null;
    uploaded_by: string;
    created_on: string;
    modified_by: string | null;
    modified_on: string;
    charset: string | null;
    filesize: string;
    width: number;
    height: number;
    duration: number | null;
    embed: string | null;
    description: string | null;
    location: string | null;
    tags: string | null;
    metadata: Record<string, unknown>;
    focal_point_x: number | null;
    focal_point_y: number | null;
    tus_id: string | null;
    tus_data: string | null;
    uploaded_on: string;
    service_categories: unknown[];
    ai_content_suggestions: unknown[];
  };
}

export async function uploadFiles(files: File[]) {
  try {
    const form = new FormData();

    files.forEach((file) => {
      form.append("files", file, file.name);
    });

    const response = await axiosInstance.post(endpoints.upload, form, {
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

// New upload file function using /files endpoint
export async function uploadFile(file: File): Promise<FileUploadResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post<FileUploadResponse>(endpoints.files, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("File upload failed:", error);
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
