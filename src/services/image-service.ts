import { siteConfig } from "@/config/site";

export interface ImageMap {
  [key: string]: string;
}

export const fetchImages = async (): Promise<ImageMap> => {
  const response = await fetch(siteConfig.endpoints.listImages());
  if (!response.ok) {
    throw new Error("Failed to list images");
  }
  return response.json();
};

export const uploadImage = async (file: File): Promise<ImageMap> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(siteConfig.endpoints.uploadImage(), {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  return response.json();
};

export const updateImageMap = async (key: string, imagePath: string) => {
  const response = await fetch(siteConfig.endpoints.updateImageMap(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key,
      image: imagePath,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update image map");
  }

  return response.json();
};
